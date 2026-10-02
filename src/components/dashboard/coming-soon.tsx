export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="mt-6 flex h-48 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
        Coming soon
      </div>
    </div>
  );
}
