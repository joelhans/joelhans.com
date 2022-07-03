const StoryQuote = ({ children, story }) => {
  return (
    <div className="flex items-center w-full bg-sea bg-opacity-10 p-12 rounded">
      <div className="!m-0">
        <div className="prose-xl lg:prose-2xl !m-0 italic">{children}</div>
        {story && <p className="!mb-0">&mdash; &ldquo;{story}&rdquo;</p>}
      </div>
    </div>
  )
}

export default StoryQuote
