import { MobileFrame } from "@/components/MobileFrame";
import { TopBar } from "@/components/TopBar";
import { useNima } from "@/context/NimaContext";
import { Trophy, Heart } from "lucide-react";

export default function DonorProfile() {
  const { donor, donations } = useNima();
  const mine = donations.filter((d) => d.donorId === donor!.id);
  const collected = mine.filter((d) => d.status === "COLLECTED").length;
  const mealsSaved = collected;

  return (
    <MobileFrame>
      <TopBar title="Your impact" subtitle="Community & milestones" />
      <div className="flex-1 overflow-y-auto px-5 pb-8 pt-4">

        <div className="rounded-2xl bg-gradient-primary text-primary-foreground p-6 shadow-elevated mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 opacity-90" />
            <div>
              <p className="text-xs uppercase tracking-wider opacity-90">Donor</p>
              <h1 className="text-xl font-bold">{donor!.businessName}</h1>
              <p className="text-sm opacity-90">{donor!.businessType}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="rounded-2xl bg-card p-5 shadow-soft ring-1 ring-black/[0.04]">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Meals saved
            </p>
            <p className="text-3xl font-black text-primary">{mealsSaved}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Completed pickups you helped finish.
            </p>
          </div>

          {collected > 5 ? (
            <div className="rounded-2xl bg-secondary/15 border border-secondary/30 p-5 flex items-center gap-4 shadow-soft">
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center shadow-soft">
                <Trophy className="w-8 h-8 text-secondary-foreground" />
              </div>
              <div>
                <p className="font-bold text-foreground">Golden champion</p>
                <p className="text-sm text-muted-foreground">
                  More than 5 rescues — thank you for leading with generosity.
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-muted/50 p-5 text-sm text-muted-foreground">
              Share {6 - collected} more completed pickups to unlock the golden trophy.
            </div>
          )}
        </div>
      </div>
    </MobileFrame>
  );
}
