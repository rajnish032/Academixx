export default function SkeletonPost() {
  return (
    <div className="mx-auto w-full max-w-[540px] bg-paper-alt border border-navy p-5 animate-pulse">

      {/* HEADER */}
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-11 h-11 bg-brass/20 border border-brass/40" />

          {/* Name + Tag */}
          <div className="space-y-2">
            <div className="w-32 h-4 bg-brass/20" />
            <div className="w-16 h-3 bg-brass/20" />
          </div>
        </div>

        {/* Edit / Delete icons placeholder */}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-brass/20" />
          <div className="w-4 h-4 bg-brass/20" />
        </div>
      </div>

      {/* TEXT */}
      <div className="mt-4 space-y-2">
        <div className="w-full h-3 bg-brass/20" />
        <div className="w-5/6 h-3 bg-brass/20" />
        <div className="w-3/4 h-3 bg-brass/20" />
      </div>

      {/* MEDIA */}
      <div className="relative mt-4 flex justify-center">
        <div className="w-full max-h-[55vh] h-[320px] bg-brass/15 border border-brass/30" />
      </div>

      {/* ACTIONS */}
      <div className="flex justify-between mt-4 pt-3 border-t border-brass/30">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-brass/20" />
          <div className="w-6 h-3 bg-brass/20" />
        </div>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-brass/20" />
          <div className="w-6 h-3 bg-brass/20" />
        </div>
      </div>
    </div>
  );
}