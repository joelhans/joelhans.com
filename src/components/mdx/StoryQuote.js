const StoryQuote = ({ children, story }) => {
  return (
    <div className="flex items-center bg-sea bg-opacity-10 lg:-mx-8 p-8 rounded">
      <div className="!m-0">
        <div className="prose prose-lg lg:prose-2xl dark:prose-dark !m-0 italic">{children}</div>
        {story && <p className="!mb-0">&mdash; &ldquo;{story}&rdquo;</p>}
      </div>
    </div>
  )
}

export default StoryQuote
