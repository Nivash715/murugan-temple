
export function PageHero({ eyebrow, titleTamil, titleEn, description, image }) {
  return (
    <section className="relative-z overflow-hidden">
      <div className="mx-auto max-w-6xl px-3 sm:px-5 lg:px-8 pt-6 lg:pt-12 pb-8 lg:pb-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-12 gap-5 lg:gap-6 items-center">
        <div className="sm:col-span-1 lg:col-span-7 xl:col-span-6 relative">
          <div className="relative">
            <span className="tamil-chip">{eyebrow}</span>
            <h1 className="mt-4 font-tamil text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl font-bold text-ink leading-[1.05] break-words">
              {titleTamil}
            </h1>
            <div className="mt-2 font-display italic text-base sm:text-lg lg:text-xl text-brass-deep">
              {titleEn}
            </div>
            <div className="mt-5 lg:mt-6 flex items-start gap-3 max-w-md">
              <div className="w-1 self-stretch bg-gradient-brass rounded-full" />
              <p className="font-tamil-sans text-sm lg:text-base text-ink/75 leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </div>
        <div className="sm:col-span-1 lg:col-span-5 xl:col-span-6 relative">
          <div className="absolute -inset-3 bg-gradient-sunset rounded-2xl blur-2xl opacity-25" />
          <div className="relative aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden shadow-temple border border-brass/30 max-w-[280px] sm:max-w-[320px] mx-auto lg:mx-0">
            <img src={image} alt={titleEn} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
