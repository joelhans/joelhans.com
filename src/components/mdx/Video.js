const Video = ({ src, autoPlay, controls, muted, loop }) => {
  const props = {
    autoPlay: autoPlay || false,
    controls: controls || true,
    muted: muted || true,
    loop: loop || true,
  }

  let youtube = false
  if (src.includes('youtube.com')) {
    youtube = true
  }

  return (
    <>
      {youtube ? (
        <iframe
          width="812"
          height="455"
          className="w-full min-h-full"
          src={src}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="px-6 py-8 bg-sea bg-opacity-10 rounded-lg">
          <video className="!mt-0 !mb-0" {...props} preload="preload">
            <source src={src} type="video/mp4" />
            Sorry, your browser doesn't support embedded videos.
          </video>
        </div>
      )}
    </>
  )
}

export default Video
