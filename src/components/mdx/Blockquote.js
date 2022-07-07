const Blockquote = ({ children }) => {
  return (
    <div className="flex items-center bg-gray-50 dark:bg-gray-800 lg:-mx-8 px-8 py-4 rounded">
      <div className="!m-0">
        <div className="prose prose-lg lg:prose-xl dark:prose-dark">{children}</div>
      </div>
    </div>
  )
}

export default Blockquote
