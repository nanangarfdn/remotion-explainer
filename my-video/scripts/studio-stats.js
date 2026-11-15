// Paste as the `text` of claude-in-chrome javascript_tool on studio.youtube.com/video/<id>/analytics/tab-overview/period-default
// (navigate first in a separate call; Studio UI in Bahasa Indonesia). Returns one line instead of a ~1.5k-token page dump.
// views ≥ 1k come rounded ("1,3 rb"), so avgS is ± a few %; exact views are in the Konten list.
await new Promise((r) => setTimeout(r, 6000));
{
  const t = document.querySelector("ytcp-app").innerText.replace(/\n{2,}/g, "\n");
  const after = (k) => (t.split(k + "\n")[1] || "").split("\n")[0];
  const n = (s) => { const m = (s || "").replace(/\./g, "").replace(",", ".").match(/[\d.]+/); return m ? parseFloat(m[0]) * (/rb/.test(s) ? 1000 : /jt/.test(s) ? 1e6 : 1) : NaN; };
  const views = n(after("Penayangan")), hours = n(after("Waktu tonton (jam)"));
  const len = after("Konten channel"), sec = len.split(/[.:]/).reduce((a, b) => a * 60 + +b, 0);
  const avg = Math.round((hours * 3600) / views);
  const recent = t.match(/Penayangan (60 menit|48 jam)\n([\d.,]+)/);
  ({
    title: after("Video Anda"), len, views, watchH: hours, avgS: avg, avgPct: sec ? Math.round((avg / sec) * 100) : null,
    stayed: (t.match(/([\d,]+%)\nTetap menonton/) || [])[1], likes: n((t.split("Suka\nSejak dipublikasikan\n")[1] || "").split("\n")[0]),
    subs: after("Subscriber"), recent: recent ? `${recent[2]} / ${recent[1]}` : null,
  });
}
