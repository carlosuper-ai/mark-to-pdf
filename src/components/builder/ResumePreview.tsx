import { useActiveResume } from "@/lib/resume-store";
import { ModernTemplate } from "./templates/Modern";
import { ProfessionalTemplate } from "./templates/Professional";

export function ResumePreview({ zoom = 0.85 }: { zoom?: number }) {
  const resume = useActiveResume();
  const Template =
    resume.theme.template === "professional"
      ? ProfessionalTemplate
      : ModernTemplate;

  // A4 at 96dpi ≈ 794 × 1123 px
  return (
    <div className="flex justify-center py-8 overflow-auto">
      <div
        style={{
          width: 794 * zoom,
          minHeight: 1123 * zoom,
        }}
      >
        <div
          className="resume-paper print-area"
          style={{
            width: 794,
            minHeight: 1123,
            transform: `scale(${zoom})`,
            transformOrigin: "top left",
          }}
        >
          <Template resume={resume} />
        </div>
      </div>
    </div>
  );
}