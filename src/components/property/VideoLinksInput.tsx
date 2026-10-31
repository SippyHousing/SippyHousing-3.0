// import React, { useState } from "react";
// import { Control, Controller, FieldValues, Path } from "react-hook-form";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Plus, X, Video } from "lucide-react";
// import { parseVideoUrl, getVideoLabel } from "@/lib/video";

// interface VideoLinksInputProps<T extends FieldValues> {
//   control: Control<T>;
// }

// export function VideoLinksInput<T extends FieldValues>({ control }: VideoLinksInputProps<T>) {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Video className="h-5 w-5" />
//           Video Links
//         </CardTitle>
//         <CardDescription>
//           Add video links for this property (YouTube, Instagram reels/posts, Vimeo or direct .mp4). Videos play inside the property page – visitors are not sent to YouTube/Instagram.
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <Controller
//           name={'video_links' as Path<T>}
//           control={control}
//           render={({ field }) => {
//             const videoLinks = (field.value as string[]) || [];
//             const [newVideoUrl, setNewVideoUrl] = useState('');

//             const addVideoLink = () => {
//               if (newVideoUrl.trim()) {
//                 const url = newVideoUrl.trim();
//                 // Basic URL validation
//                 if (url.startsWith('http://') || url.startsWith('https://')) {
//                   field.onChange([...videoLinks, url]);
//                   setNewVideoUrl('');
//                 } else {
//                   // Auto-add https:// if missing
//                   field.onChange([...videoLinks, `https://${url}`]);
//                   setNewVideoUrl('');
//                 }
//               }
//             };

//             const removeVideoLink = (index: number) => {
//               field.onChange(videoLinks.filter((_, i) => i !== index));
//             };

//             return (
//               <div className="space-y-4">
//                 <div className="flex gap-2">
//                   <Input
//                     type="url"
//                     placeholder="YouTube, Instagram (reel/post) or Vimeo link"
//                     value={newVideoUrl}
//                     onChange={(e) => setNewVideoUrl(e.target.value)}
//                     // Auto-add when the admin clicks away or saves without pressing "Add",
//                     // so a pasted link is never silently lost
//                     onBlur={() => { if (newVideoUrl.trim()) addVideoLink(); }}
//                     onPaste={(e) => {
//                       const pasted = e.clipboardData.getData('text').trim();
//                       if (/^https?:\/\//i.test(pasted) && !pasted.includes(' ')) {
//                         e.preventDefault();
//                         field.onChange([...videoLinks, pasted]);
//                         setNewVideoUrl('');
//                       }
//                     }}
//                     onKeyDown={(e) => {
//                       if (e.key === 'Enter') {
//                         e.preventDefault();
//                         addVideoLink();
//                       }
//                     }}
//                     className="flex-1"
//                   />
//                   <Button
//                     type="button"
//                     onClick={addVideoLink}
//                     disabled={!newVideoUrl.trim()}
//                   >
//                     <Plus className="h-4 w-4 mr-2" />
//                     Add
//                   </Button>
//                 </div>

//                 {videoLinks.length > 0 && (
//                   <div className="space-y-2">
//                     <Label>Added Video Links ({videoLinks.length})</Label>
//                     <div className="space-y-2">
//                       {videoLinks.map((url, index) => (
//                         <div
//                           key={index}
//                           className="flex items-center gap-2 p-2 bg-accent rounded-md"
//                         >
//                           <Video className="h-4 w-4 text-muted-foreground" />
//                           <span className="text-xs font-semibold px-2 py-0.5 rounded bg-background border">
//                             {getVideoLabel(parseVideoUrl(url).provider)}
//                           </span>
//                           <a
//                             href={url}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="flex-1 text-sm text-primary hover:underline truncate"
//                           >
//                             {url}
//                           </a>
//                           <Button
//                             type="button"
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => removeVideoLink(index)}
//                             className="h-8 w-8 p-0"
//                           >
//                             <X className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {newVideoUrl.trim() && (
//                   <p className="text-xs text-amber-600">Click "Add" (or press Enter) to save this link before saving the property.</p>
//                 )}

//                 {videoLinks.length === 0 && (
//                   <p className="text-sm text-muted-foreground text-center py-4">
//                     No video links added yet. Add a video URL above.
//                   </p>
//                 )}
//               </div>
//             );
//           }}
//         />
//       </CardContent>
//     </Card>
//   );
// }


import React, { useRef, useState } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Video, Upload, Loader2 } from "lucide-react";
import { parseVideoUrl, getVideoLabel } from "@/lib/video";
import { supabase } from "@/lib/supabase"; // <- same Supabase client your image upload uses

// ── Upload settings (change here) ─────────────────────────────────────────
const BUCKET = "property-videos";                       // Supabase Storage bucket name
const MAX_MB = 50;                                      // Supabase free plan allows 50 MB per file
const ALLOWED = ["video/mp4", "video/webm", "video/quicktime"];

interface VideoLinksInputProps<T extends FieldValues> {
  control: Control<T>;
}

export function VideoLinksInput<T extends FieldValues>({ control }: VideoLinksInputProps<T>) {
  // useController replaces the old <Controller> so the state below can live at the top
  // of the component (hooks must not be called inside a render callback).
  const { field } = useController({ name: "video_links" as Path<T>, control });
  const videoLinks = (field.value as string[]) || [];

  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const addLink = (raw: string) => {
    const url = raw.trim();
    if (!url) return;
    const full = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    field.onChange([...videoLinks, full]);
    setNewVideoUrl("");
  };

  const removeLink = (index: number) => {
    // The file stays in Supabase Storage; delete unused files from the dashboard if needed.
    field.onChange(videoLinks.filter((_, i) => i !== index));
  };

  const uploadFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setError("");
    setUploading(true);
    const added: string[] = [];

    for (const file of Array.from(files)) {
      if (!ALLOWED.includes(file.type)) {
        setError(`${file.name}: only MP4, WebM or MOV videos are allowed.`);
        continue;
      }
      if (file.size > MAX_MB * 1024 * 1024) {
        setError(`${file.name} is ${(file.size / 1048576).toFixed(0)} MB. The limit is ${MAX_MB} MB - compress it first.`);
        continue;
      }
      const ext = file.name.split(".").pop()?.toLowerCase() || "mp4";
      const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { cacheControl: "31536000", contentType: file.type });
      if (upErr) {
        setError(`${file.name}: ${upErr.message}`);
        continue;
      }
      added.push(supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl);
    }

    if (added.length) field.onChange([...videoLinks, ...added]); // saved in the same video_links list
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const isUploaded = (url: string) => url.includes(`/${BUCKET}/`);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Videos
        </CardTitle>
        <CardDescription>
          Paste a link (YouTube, Instagram reel/post, Vimeo or direct .mp4) or upload a video file.
          Videos play inside the property page - visitors are not sent to YouTube/Instagram.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Option 1: paste a link */}
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="YouTube, Instagram (reel/post) or Vimeo link"
              value={newVideoUrl}
              onChange={(e) => setNewVideoUrl(e.target.value)}
              // Auto-add when the admin clicks away, so a pasted link is never silently lost
              onBlur={() => { if (newVideoUrl.trim()) addLink(newVideoUrl); }}
              onPaste={(e) => {
                const pasted = e.clipboardData.getData("text").trim();
                if (/^https?:\/\//i.test(pasted) && !pasted.includes(" ")) {
                  e.preventDefault();
                  addLink(pasted);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addLink(newVideoUrl);
                }
              }}
              className="flex-1"
            />
            <Button type="button" onClick={() => addLink(newVideoUrl)} disabled={!newVideoUrl.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          {/* Option 2: upload a file */}
          <div className="rounded-md border border-dashed p-4 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={fileRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                multiple
                className="hidden"
                onChange={(e) => uploadFiles(e.target.files)}
              />
              <Button type="button" variant="outline" disabled={uploading} onClick={() => fileRef.current?.click()}>
                {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                {uploading ? "Uploading..." : "Upload video"}
              </Button>
              <span className="text-xs text-muted-foreground">
                MP4 / WebM / MOV, up to {MAX_MB} MB each.
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Tip for a fast website: export at 720p, MP4 (H.264), under 60 seconds and ideally under 20 MB.
              For long videos use a YouTube or Vimeo link instead.
            </p>
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          {/* Added videos */}
          {videoLinks.length > 0 && (
            <div className="space-y-2">
              <Label>Added videos ({videoLinks.length})</Label>
              <div className="space-y-2">
                {videoLinks.map((url, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-accent rounded-md">
                    {isUploaded(url) ? (
                      <video src={url} preload="metadata" muted className="h-12 w-20 rounded object-cover bg-black" />
                    ) : (
                      <Video className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-background border">
                      {isUploaded(url) ? "Uploaded" : getVideoLabel(parseVideoUrl(url).provider)}
                    </span>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-sm text-primary hover:underline truncate"
                    >
                      {isUploaded(url) ? decodeURIComponent(url.split("/").pop() || url) : url}
                    </a>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLink(index)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {newVideoUrl.trim() && (
            <p className="text-xs text-amber-600">Click "Add" (or press Enter) to save this link before saving the property.</p>
          )}

          {videoLinks.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-2">
              No videos added yet. Paste a link or upload a file above.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
