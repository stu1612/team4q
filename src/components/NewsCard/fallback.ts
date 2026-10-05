// RD-shaped fallback for NewsCardModel (fetchWithFallback). Same shape as the
// NewsCardList query result: `teamModel` relation, `clubMemberModel` author, `body` as a
// RichText { html, text }. Cover images stay local imports; author photo is left null to
// exercise the hasAuthorPhoto=false path.
//
// These are full, readable articles, not stubs: during a Hygraph outage the homepage and
// /nyheter render these cards, and each one must open as a real article on
// /nyheter/[slug]. They are deliberately evergreen — no results, signings, sponsors or
// dates-in-the-copy — so nothing goes stale or reads as invented news. Facts used are only
// those already stated elsewhere on the site (founded 2016, Helsingborg, the three halls,
// the three teams, the club email).
//
// Ordered newest-first (matches the live query's publishedDate_DESC) since the homepage's
// 5-card mosaic assigns cards positionally — a Hygraph outage should still render the full
// mosaic, not a hole in it, so this needs at least 5 entries.
//
// TODO(club): have the club review the wording before launch.

import teamNews from "../../images/fallback/news/team-news.jpg";
import womenNews from "../../images/fallback/news/women-news.jpg";
import juniorNews from "../../images/fallback/news/junior-news.jpg";
import resultNews from "../../images/fallback/news/result-news.jpg";
import mensCover from "../../images/fallback/teams/mens-cover.jpg";
import { CLUB_CONTACT } from "../../constants/contact";
import type { AuthorRD, NewsCardResponseRD } from "./types";

const author: AuthorRD = {
  name: "Team Fourth Quarter",
  role: null,
  profileImage: null,
};

/** RichText-shaped body from an HTML string — `text` is the tag-stripped copy, matching
 *  what Hygraph returns alongside `html`. */
const rich = (html: string) => ({
  html: html.trim(),
  text: html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim(),
});

const mail = `<a href="mailto:${CLUB_CONTACT.email}">${CLUB_CONTACT.email}</a>`;

export const newsCardFallback: NewsCardResponseRD = {
  newsCardModels: [
    {
      heading: "Välkommen till Team Fourth Quarter",
      slug: "vaelkommen-till-team-fourth-quarter",
      publishedDate: "2026-09-15",
      excerpt:
        "En basketklubb i Helsingborg för alla åldrar – med herrlag, damlag och ungdomsverksamhet under samma tak.",
      body: rich(`
<p>Team Fourth Quarter – T4Q – är en basketklubb i Helsingborg. Sedan 2016 har vi byggt en förening där barn, ungdomar och seniorer tränar, tävlar och utvecklas tillsammans.</p>
<h2>En klubb, tre lag</h2>
<p>Vi har tre lag: <a href="/herrlaget">herrlaget</a>, <a href="/damlaget">damlaget</a> och <a href="/ungdomslaget">ungdomslaget</a>. Lagen tränar i tre hallar runt om i staden – GA Hallen, Rydebäck och Harlyckehallen.</p>
<h2>Mer än basket</h2>
<p>Klubben har aldrig bara handlat om basket. Det handlar om människorna som kommer tillbaka vecka efter vecka, vänskapen som växer fram och en gemenskap som sträcker sig långt bortom slutsignalen.</p>
<p>Vill du veta mer, spela med oss eller stötta klubben? Hör av dig till ${mail} – vi svarar gärna.</p>
`),
      coverImage: teamNews,
      // General club news — no team tag, exercises the hasTeam=false path.
      teamModel: null,
      clubMemberModel: author,
    },
    {
      heading: "Vill du börja spela basket? Så kommer du igång",
      slug: "vill-du-boerja-spela-basket-sa-kommer-du-igang",
      publishedDate: "2026-09-01",
      excerpt:
        "Nybörjare, återvändare eller rutinerad spelare – här är allt du behöver veta för att komma till din första träning.",
      body: rich(`
<p>Du behöver inte ha spelat förut för att vara välkommen hos oss. Oavsett om du aldrig hållit i en basketboll, vill komma tillbaka efter några år eller har spelat länge finns det en plats för dig i T4Q.</p>
<h2>Så gör du</h2>
<ol>
  <li>Kolla <a href="/traning">träningstiderna</a> för det lag som passar dig.</li>
  <li>Mejla ${mail} och berätta lite om dig själv, så hjälper vi dig att hitta rätt grupp.</li>
  <li>Kom till hallen en kvart innan träningen börjar och presentera dig för tränaren.</li>
</ol>
<h2>Vad ska jag ta med?</h2>
<ul>
  <li>Inneskor med ljus sula</li>
  <li>Bekväma träningskläder</li>
  <li>Vattenflaska</li>
</ul>
<p>Du kan prova på några träningar innan du bestämmer dig. Det viktigaste är att du har roligt – resten kommer med tiden.</p>
`),
      coverImage: resultNews,
      teamModel: null,
      clubMemberModel: author,
    },
    {
      heading: "Basket för barn och ungdomar – så fungerar ungdomslaget",
      slug: "basket-foer-barn-och-ungdomar-sa-fungerar-ungdomslaget",
      publishedDate: "2026-08-20",
      excerpt:
        "Glädje, gemenskap och utveckling i egen takt – så tar vi hand om klubbens yngsta spelare.",
      body: rich(`
<p>Ungdomslaget är hjärtat i T4Q. Här lär sig barn och ungdomar grunderna i basket i en trygg miljö där alla får vara med och utvecklas i sin egen takt.</p>
<h2>Vad vi fokuserar på</h2>
<ul>
  <li><strong>Glädje först</strong> – träningen ska vara rolig, varje gång.</li>
  <li><strong>Grundteknik</strong> – dribbling, passningar och skott, steg för steg.</li>
  <li><strong>Laganda</strong> – vi vinner, förlorar och utvecklas tillsammans.</li>
</ul>
<h2>Till dig som förälder</h2>
<p>Ditt barn behöver ingen tidigare erfarenhet. Träningstiderna hittar du på sidan för <a href="/traning">träning</a>, och mer om lagets upplägg på <a href="/ungdomslaget">ungdomslagets sida</a>. Har du frågor är du alltid välkommen att kontakta oss på ${mail}.</p>
<p>Vi välkomnar också föräldrar som vill hjälpa till – som skjutsande, vid matcher eller som ledare. Det är tillsammans vi gör klubben möjlig.</p>
`),
      coverImage: juniorNews,
      teamModel: { name: "Ungdom", slug: "ungdomslaget" },
      clubMemberModel: author,
    },
    {
      heading: "Damlaget välkomnar nya spelare",
      slug: "damlaget-vaelkomnar-nya-spelare",
      publishedDate: "2026-08-06",
      excerpt:
        "Damlaget kombinerar seriespel med en stark gemenskap – och det finns alltid plats för fler.",
      body: rich(`
<p>T4Q:s damlag är en grupp som tränar och tävlar med ambition, men där gemenskapen alltid kommer först. Laget välkomnar både rutinerade spelare och dig som vill komma tillbaka till basketen.</p>
<h2>Träning och matcher</h2>
<p>Laget tränar regelbundet under säsongen och spelar seriematcher i regionen. Aktuella tider finns på sidan för <a href="/traning">träning</a>, och kommande matcher hittar du på <a href="/damlaget">damlagets sida</a>.</p>
<h2>Kom och prova</h2>
<p>Är du nyfiken på att spela? Mejla ${mail} så berättar vi mer och ser till att du får en bra start. Du är också varmt välkommen att komma och heja på laget på en hemmamatch.</p>
`),
      coverImage: womenNews,
      teamModel: { name: "Dam", slug: "damlaget" },
      clubMemberModel: author,
    },
    {
      heading: "Herrlaget – ambition på planen, gemenskap utanför",
      slug: "herrlaget-ambition-pa-planen-gemenskap-utanfoer",
      publishedDate: "2026-07-24",
      excerpt:
        "Herrlaget satsar på seriespel i regionen och söker alltid spelare som vill utvecklas tillsammans med laget.",
      body: rich(`
<p>T4Q:s herrlag spelar seriebasket i regionen med en trupp som vill utvecklas – både som spelare och som lag. Här möts erfarna spelare och yngre förmågor som tagit steget upp från ungdomsverksamheten.</p>
<h2>Så arbetar laget</h2>
<ul>
  <li>Regelbundna träningar med fokus på spelförståelse och fysik</li>
  <li>Seriematcher hemma och borta under säsongen</li>
  <li>Ett lag där alla bidrar – på planen och utanför</li>
</ul>
<h2>Följ laget</h2>
<p>Kommande matcher och resultat hittar du på <a href="/herrlaget">herrlagets sida</a>. Vill du spela? Hör av dig till ${mail}.</p>
`),
      coverImage: mensCover,
      teamModel: { name: "Herr", slug: "herrlaget" },
      clubMemberModel: author,
    },
  ],
};
