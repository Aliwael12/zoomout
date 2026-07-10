import { FILLS, FUNNEL, PEOPLE, TIER_DIST, TOP_REFERRERS } from "@/lib/data";
import { initials } from "@/lib/types";

/**
 * Static, illustrative numbers, rendered as a server component. Bars carry
 * `data-tip` attributes; the global TooltipLayer handles hover/focus.
 */
export function InsightsScreen() {
  const totalMembers = TIER_DIST.reduce((s, d) => s + d.count, 0);
  const maxTier = Math.max(...TIER_DIST.map((d) => d.count));
  const maxFunnel = FUNNEL[0].count;

  return (
    <>
      <div className="section-eyebrow">
        Insights <span className="demo-tag" style={{ letterSpacing: ".04em" }}>illustrative numbers</span>
      </div>

      <div className="tiles">
        <div className="tile">
          <div className="t-label">Repeat rate</div>
          <div className="t-num">
            57<small>%</small>
          </div>
          <div className="t-sub">
            <span className="delta">▲ 6 pts</span> vs last season · travelers with 2+ trips
          </div>
        </div>
        <div className="tile">
          <div className="t-label">Referral share</div>
          <div className="t-num">
            41<small>%</small>
          </div>
          <div className="t-sub">of new applicants name a referrer</div>
        </div>
        <div className="tile">
          <div className="t-label">Club members</div>
          <div className="t-num">238</div>
          <div className="t-sub">everyone who ever traveled, now on one list you own</div>
        </div>
        <div className="tile">
          <div className="t-label">Trips run</div>
          <div className="t-num">12</div>
          <div className="t-sub">since Nov &apos;24 · 92% average fill</div>
        </div>
      </div>

      <div className="charts">
        <div className="chart-card">
          <h3>Tier distribution</h3>
          <div className="c-sub">{totalMembers} members by club tier</div>
          {TIER_DIST.map((d) => (
            <div
              key={d.tier}
              className="hbar-row"
              tabIndex={0}
              data-tip={`${d.label}: ${d.count} members · ${Math.round((d.count / totalMembers) * 100)}% of the club`}
            >
              <span className="lbl">{d.label}</span>
              <div className="hbar-track">
                <div className="hbar" style={{ width: `${(d.count / maxTier) * 100}%`, background: `var(--t-${d.tier})` }} />
              </div>
              <span className="val">{d.count}</span>
            </div>
          ))}
        </div>

        <div className="chart-card">
          <h3>Referral funnel</h3>
          <div className="c-sub">referred friends this season, step by step</div>
          {FUNNEL.map((stage, i) => {
            const prev = i ? FUNNEL[i - 1] : stage;
            const pct = Math.round((stage.count / prev.count) * 100);
            const tip = i
              ? `${stage.label}: ${stage.count} · ${pct}% of ${prev.label.toLowerCase()}`
              : `${stage.label}: ${stage.count} friends named this season`;
            return (
              <div key={stage.label} className="hbar-row" tabIndex={0} data-tip={tip}>
                <span className="lbl">{stage.label}</span>
                <div className="hbar-track">
                  <div
                    className="hbar"
                    style={{ width: `${(stage.count / maxFunnel) * 100}%`, background: "var(--brand)", opacity: 1 - i * 0.14 }}
                  />
                </div>
                <span className="val">{stage.count}</span>
              </div>
            );
          })}
          <div className="funnel-note">
            A &ldquo;quality referral&rdquo; = the referred friend actually travels. 49 of 96 made it. That&apos;s the number
            tiers reward.
          </div>
        </div>

        <div className="chart-card">
          <h3>Trip fill</h3>
          <div className="c-sub">last six trips, % of seats filled</div>
          <div className="vchart">
            {FILLS.map((f, i) => (
              <div
                key={i}
                className="vcol"
                tabIndex={0}
                data-tip={`${f.name} · ${f.when} · ${f.live ? `${f.pct}% so far, selection open` : `${f.pct}% of seats filled`}`}
              >
                <span className="vval">{f.pct}%</span>
                <div className={`vbar${f.live ? " live" : ""}`} style={{ height: `${f.pct}%` }} />
              </div>
            ))}
          </div>
          <div className="vlbls">
            {FILLS.map((f, i) => (
              <div key={i} className="vlbl">
                <b>{f.name}</b>
                {f.when}
              </div>
            ))}
          </div>
          <span className="live-key">
            <i />
            selection in progress
          </span>
        </div>

        <div className="chart-card">
          <h3>Top referrers</h3>
          <div className="c-sub">who actually brings travelers</div>
          <table className="referrers">
            <thead>
              <tr>
                <th>Member</th>
                <th className="num">Sent</th>
                <th className="num">Traveled</th>
                <th className="num">Conv.</th>
              </tr>
            </thead>
            <tbody>
              {TOP_REFERRERS.map((r) => {
                const p = PEOPLE[r.pid];
                return (
                  <tr key={r.pid}>
                    <td>
                      <span className="r-name">
                        <span className={`avatar sm av-${p.tier}`} aria-hidden="true">
                          {initials(p.name)}
                        </span>
                        {p.name}
                      </span>
                    </td>
                    <td className="num">{r.sent}</td>
                    <td className="num">{r.traveled}</td>
                    <td className="num conv">{Math.round((r.traveled / r.sent) * 100)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
