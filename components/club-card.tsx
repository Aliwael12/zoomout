"use client";

import Image from "next/image";
import { useState } from "react";
import { TierBadge } from "./ui";

function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code);
        } catch {
          /* clipboard unavailable; demo only */
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
    >
      {copied ? "Copied ✓" : "Copy"}
    </button>
  );
}

export function ClubScreen() {
  return (
    <div className="member-stage">
      <p className="member-note">
        The traveler side stays deliberately light: one card that answers <em>where do I stand, and what unlocks next.</em>{" "}
        This is what <strong>Malak</strong> sees.
      </p>
      <div className="club-card">
        <div className="cc-photo">
          <Image
            src="/trips/canyon.jpg"
            alt="Zoom Out travelers in a sandstone canyon, photo from @zoomouteg"
            fill
            priority
            sizes="400px"
            style={{ objectFit: "cover", objectPosition: "center 35%" }}
          />
        </div>
        <div className="cc-head">
          <Image className="cc-logo" src="/brand/logo.jpg" alt="" width={56} height={56} />
          <div className="cc-brand">Zoom Out Club</div>
          <div className="cc-name-row">
            <div>
              <div className="cc-name">Malak Adel</div>
              <div className="cc-handle">@malak.adl · member since 2024</div>
            </div>
            <TierBadge tier="insider" style={{ marginLeft: "auto" }} />
          </div>
        </div>
        <div className="cc-body">
          <div className="cc-stats">
            <div className="cc-stat">
              <b>4</b>
              <span>Trips</span>
            </div>
            <div className="cc-stat">
              <b>3</b>
              <span>Refs traveled</span>
            </div>
            <div className="cc-stat">
              <b>2</b>
              <span>To Legend</span>
            </div>
          </div>

          <div>
            <div className="cc-progress-bar">
              <i />
            </div>
            <div className="cc-progress-text">
              <span>Insider</span>
              <span>
                <b>Legend</b> · 2 more trips or 3 referrals
              </span>
            </div>
          </div>

          <div className="cc-next-trip">
            <Image src="/trips/hurghada.jpg" alt="" width={52} height={52} style={{ objectFit: "cover" }} />
            <div>
              <div className="t">Hurghada Island Hopping · Jul 23-26</div>
              <div className="s">
                <span className="yes">You&rsquo;re in ✓</span> · deposit received · details on WhatsApp
              </div>
            </div>
          </div>

          <div>
            <div className="d-label" style={{ marginBottom: 4 }}>
              Your perks
            </div>
            <div className="perk on">
              <span className="pk">✓</span>
              <span>48-hour early access to trip drops</span>
            </div>
            <div className="perk on">
              <span className="pk">✓</span>
              <span>+1 guest priority when a trip is full</span>
            </div>
            <div className="perk on">
              <span className="pk">✓</span>
              <span>Insider-only secret trips</span>
            </div>
            <div className="perk off">
              <span className="pk">🔒</span>
              <span>
                Free spot on your 8th trip<span className="tag-legend">Legend</span>
              </span>
            </div>
            <div className="perk off">
              <span className="pk">🔒</span>
              <span>
                Vote on the next destination<span className="tag-legend">Legend</span>
              </span>
            </div>
          </div>

          <div className="cc-code">
            <div>
              <div className="code">MALAK-ZO</div>
              <div className="sub">3 friends traveled with your code</div>
            </div>
            <CopyCodeButton code="MALAK-ZO" />
          </div>
        </div>
        <div className="cc-foot">Zoom out of routine. Zoom into life.</div>
      </div>
    </div>
  );
}
