export function PersonCard({
  name,
  role,
  bio,
  photo,
}: {
  name: string;
  role: string;
  bio: string;
  photo?: string;
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-sand">
        {photo ? (
          <img
            src={photo}
            alt={name}
            loading="lazy"
            className="zoom-img absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-primary font-display text-5xl text-white">
            {initials}
          </div>
        )}
      </div>
      <div className="pt-5">
        <h3 className="font-display text-xl leading-tight">{name}</h3>
        <div className="mt-1 text-sm font-medium text-accent-ink">{role}</div>
        {bio && <p className="mt-3 text-[15px] text-text/70 leading-relaxed">{bio}</p>}
      </div>
    </article>
  );
}
