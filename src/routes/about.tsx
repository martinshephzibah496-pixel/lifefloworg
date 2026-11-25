import { createFileRoute, Link } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/about")({
  head: () => seo({ title: "About LifeFlow", description: "LifeFlow is an independent educational platform helping people understand housing costs and make smarter decisions about buying, renting and moving.", path: "/about" }),
  component: () => (
    <>
      <PageHero eyebrow="About" title="Helping you understand the real cost of a home">LifeFlow turns complex housing and money questions into clear numbers and practical steps.</PageHero>
      <div className="container-page max-w-3xl py-12 prose-lf">
        <h2>Our mission</h2><p>Buying a home, renting a first apartment or moving to a new city are some of the biggest financial decisions people make. LifeFlow exists to make those decisions clearer, with free calculators, planners and guides anyone can use.</p>
        <h2>What we believe</h2>
        <ul><li><strong>Education before promotion.</strong> Our guides are written independently of any advertising.</li><li><strong>Privacy by default.</strong> Our tools never ask for account numbers or sensitive financial details.</li><li><strong>Honesty.</strong> We don't publish fake reviews, invented statistics or partnerships that don't exist.</li></ul>
        <h2>What we are not</h2><p>LifeFlow is not a lender, broker, financial adviser or law firm. Our tools provide estimates for education only. Please consult a licensed professional before making financial decisions.</p>
        <p>Questions or ideas? <Link to="/contact">Get in touch</Link>.</p>
      </div>
    </>
  ),
});
