const EventPageSkeleton = () => {
  return (
    <section className="space-y-10">
      {/* Hero Image */}
      <div className="relative w-full h-80 bg-dark-200/50 rounded-xl overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-r from-dark-200/0 via-dark-100/50 to-dark-200/0 animate-shimmer"
          style={{
            backgroundSize: "200% 100%",
            animation: "shimmer 2s infinite",
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* LEFT SECTION */}
        <div className="md:col-span-8 space-y-8">
          {/* Title */}
          <div className="relative h-8 bg-dark-200/50 rounded-lg w-1/3 overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-dark-200/0 via-dark-100/50 to-dark-200/0 animate-shimmer"
              style={{
                backgroundSize: "200% 100%",
                animation: "shimmer 2s infinite",
              }}
            />
          </div>

          {/* Overview */}
          <div className="space-y-3">
            {[66, 100, 85].map((width, i) => (
              <div
                key={i}
                className="relative h-4 bg-dark-200/50 rounded w-full overflow-hidden"
                style={{ width: `${width}%` }}
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r from-dark-200/0 via-dark-100/50 to-dark-200/0"
                  style={{
                    backgroundSize: "200% 100%",
                    animation: "shimmer 2s infinite",
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              </div>
            ))}
          </div>

          {/* Event Details */}
          <div className="space-y-4">
            <div className="relative h-6 bg-dark-200/50 rounded-lg w-1/4 overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-dark-200/0 via-dark-100/50 to-dark-200/0"
                style={{
                  backgroundSize: "200% 100%",
                  animation: "shimmer 2s infinite",
                }}
              />
            </div>
            {[50, 33, 40].map((width, i) => (
              <div
                key={i}
                className="relative h-4 bg-dark-200/50 rounded w-full overflow-hidden"
                style={{ width: `${width}%` }}
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r from-dark-200/0 via-dark-100/50 to-dark-200/0"
                  style={{
                    backgroundSize: "200% 100%",
                    animation: "shimmer 2s infinite",
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              </div>
            ))}
          </div>

          {/* Agenda */}
          <div className="space-y-4">
            <div className="relative h-6 bg-dark-200/50 rounded-lg w-1/4 overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-dark-200/0 via-dark-100/50 to-dark-200/0"
                style={{
                  backgroundSize: "200% 100%",
                  animation: "shimmer 2s infinite",
                }}
              />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="relative h-3 bg-dark-200/50 rounded w-full overflow-hidden"
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r from-dark-200/0 via-dark-100/50 to-dark-200/0"
                  style={{
                    backgroundSize: "200% 100%",
                    animation: "shimmer 2s infinite",
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              </div>
            ))}
          </div>

          {/* About */}
          <div className="space-y-3">
            <div className="relative h-6 bg-dark-200/50 rounded-lg w-1/4 overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-dark-200/0 via-dark-100/50 to-dark-200/0"
                style={{
                  backgroundSize: "200% 100%",
                  animation: "shimmer 2s infinite",
                }}
              />
            </div>
            {[75, 100].map((width, i) => (
              <div
                key={i}
                className="relative h-4 bg-dark-200/50 rounded w-full overflow-hidden"
                style={{ width: `${width}%` }}
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r from-dark-200/0 via-dark-100/50 to-dark-200/0"
                  style={{
                    backgroundSize: "200% 100%",
                    animation: "shimmer 2s infinite",
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="md:col-span-4 space-y-4 p-5 border border-border-dark rounded-xl bg-dark-100/30 backdrop-blur-sm">
          <div className="relative h-6 bg-dark-200/50 rounded-lg w-1/2 overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-dark-200/0 via-dark-100/50 to-dark-200/0"
              style={{
                backgroundSize: "200% 100%",
                animation: "shimmer 2s infinite",
              }}
            />
          </div>

          <div className="relative h-4 bg-dark-200/50 rounded w-full overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-dark-200/0 via-dark-100/50 to-dark-200/0"
              style={{
                backgroundSize: "200% 100%",
                animation: "shimmer 2s infinite",
              }}
            />
          </div>

          <div className="relative h-10 bg-dark-200/50 rounded-lg w-full overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-dark-200/0 via-dark-100/50 to-dark-200/0"
              style={{
                backgroundSize: "200% 100%",
                animation: "shimmer 2s infinite",
              }}
            />
          </div>

          <div className="relative h-10 bg-dark-200/50 rounded-lg w-full mt-4 overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-dark-200/0 via-dark-100/50 to-dark-200/0"
              style={{
                backgroundSize: "200% 100%",
                animation: "shimmer 2s infinite",
              }}
            />
          </div>
        </div>
      </div>

      {/* Similar Events */}
      <div className="space-y-5">
        <div className="relative h-8 bg-dark-200/50 rounded-lg w-1/4 overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-r from-dark-200/0 via-dark-100/50 to-dark-200/0"
            style={{
              backgroundSize: "200% 100%",
              animation: "shimmer 2s infinite",
            }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="relative w-full h-40 bg-dark-200/50 rounded-xl overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-dark-200/0 via-dark-100/50 to-dark-200/0"
                  style={{
                    backgroundSize: "200% 100%",
                    animation: "shimmer 2s infinite",
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              </div>
              <div className="relative h-4 bg-dark-200/50 rounded w-2/3 overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-dark-200/0 via-dark-100/50 to-dark-200/0"
                  style={{
                    backgroundSize: "200% 100%",
                    animation: "shimmer 2s infinite",
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              </div>
              <div className="relative h-3 bg-dark-200/50 rounded w-1/2 overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-dark-200/0 via-dark-100/50 to-dark-200/0"
                  style={{
                    backgroundSize: "200% 100%",
                    animation: "shimmer 2s infinite",
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </section>
  );
};

export default EventPageSkeleton;
