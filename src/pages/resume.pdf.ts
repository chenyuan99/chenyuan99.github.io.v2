import type { APIRoute } from "astro";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { resume } from "@/data/resume";

export const prerender = true;
export const GET: APIRoute = async () => {
  const doc = await PDFDocument.create();
  doc.setTitle(resume.name + " — Resume");
  doc.setAuthor(resume.name);
  const normal = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const ink = rgb(0.1,0.15,0.17);
  const accent = rgb(0.08,0.35,0.30);
  let page = doc.addPage([612,792]);
  let y = 748;
  const margin = 48;
  const line = (text:string, size=10, strong=false, color=ink, indent=0) => {
    const font = strong ? bold : normal;
    const words = text.replace(/[–—]/g,"-").replace(/·/g,"|").split(/\s+/);
    let row = "";
    for (const word of words) {
      const next = row ? row+" "+word : word;
      if (row && font.widthOfTextAtSize(next,size)>612-margin*2-indent) {
        if(y<48){ page = doc.addPage([612,792]); y=748; }
        page.drawText(row,{x:margin+indent,y,size,font,color}); y-=size+4; row=word;
      } else row=next;
    }
    if(y<48){page=doc.addPage([612,792]);y=748;}
    page.drawText(row,{x:margin+indent,y,size,font,color}); y-=size+4;
  };
  const heading = (text:string) => { y-=10; line(text.toUpperCase(),11,true,accent); y-=2; };
  line(resume.name,27,true);
  line(resume.title+" | "+resume.location,11,true,accent);
  line("linkedin.com/in/yuancc | github.com/chenyuan99",9);
  y-=5; line(resume.summary);
  heading("Experience");
  for (const job of resume.experience) {
    line(job.role+" — "+job.company,10,true);
    line(job.period+" | "+job.location,9,false,accent);
    for (const bullet of job.bullets) line("- "+bullet,9,false,ink,8);
    y-=5;
  }
  heading("Education");
  for (const e of resume.education) line(e.school+" — "+e.degree+" | "+e.period,10);
  heading("Technical skills");
  for (const skill of resume.skills) line(skill.category+": "+skill.items.join(", "),9);
  const bytes = await doc.save();
  return new Response(new Uint8Array(bytes).buffer,{headers:{"Content-Type":"application/pdf","Content-Disposition":'attachment; filename="Yuan_Chen_Resume.pdf"'}});
};
