import { Fragment, useEffect, useState } from "react"
import { continueStory, createImagePrompt, startNewStory } from "../helper/story"
import { ChatMessage, Colors, StoryBaseline } from '../helper/types'

const Gameplay = () => {

  const [baseline, setBaseline] = useState<StoryBaseline>({
    title: '',
    summary: '',
    message: ''
  })

  const [conversation, setConversation] = useState<ChatMessage[]>([])
  const [colors, setColors] = useState<Colors>()

  const [userCommand, setUserCommand] = useState('')

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const startGame = async () => {
      const story = await startNewStory()
      setLoading(false)
      setBaseline({ title: story.title, summary: story.summary, message: story.message })
      setColors(story.colors)
    }

    startGame()
  }, [])

  const takeAction = async () => {

    const userRequest = {
      role: 'user',
      content: userCommand
    }

    const msgs = [{
      role: 'assistant',
      content: baseline.summary,
    }, ...conversation, userRequest]

    setUserCommand('')
    setLoading(true)

    const response = await continueStory(msgs)

    console.log(response)
    setConversation([...conversation, userRequest, {
      role: 'assistant',
      content: response ?? ''
    }])
    setLoading(false)
  }

  const generateImage = async () => {

    const userRequest = {
      role: 'user',
      content: `Imagine that you are speaking with an artist about a picture you want them to create for this story. You must include a subject (the main focus of the visual), what the subject is doing, where, and how, along with additional descriptive words to describe the rendering's visual style. And the description should be concise in a paragraph while capturing all the aesthetics and details about the surroundings you want to incorporate in the picture based on this story plot. You must consider all the actions that the user did in the story and important artifacts.  
      ensure that you show the character in the image engaging with items or doing what exactly presented in the story.`
    }

    const msgs = [{
      role: 'assistant',
      content: baseline.summary,
    }, ...conversation, userRequest]

    setUserCommand('')
    setLoading(true)

    const response = await createImagePrompt(msgs)

    console.log(response)
    setConversation([...conversation, userRequest, {
      role: 'assistant',
      content: response ?? ''
    }])
    setLoading(false)
  }

  return <div className="flex flex-col flex-1 w-2/3 py-12 h-full">
    <div className="relative rounded-lg bg-white bg-opacity-20 backdrop-blur-3xl border-white flex flex-col flex-1 mb-2 max-h-[80vh]">
      <div className="overflow-y-auto overflow-x-hidden mb-16">
        <div className={`h-auto m-4 rounded-lg p-4 bg-white text-black`}>
          <p className="text-justify text-lg">
            <h1>{baseline.title}</h1> <br></br>

            {baseline.message.split("<br>").map((line, index) => (
              <Fragment key={index}>
                {line.replace("<br>", "")}
                <br />
              </Fragment>
            ))}
          </p>
        </div>
        {conversation.map(i => {
          return (
            <div key={i.content.slice(0, 10)} className={"h-auto mx-4 rounded-lg p-4 " + (i.role == "user" ? "bg-accent" : "bg-white")}>
              <p className="text-justify text-lg">
                {i.content.split("<br>").map((line, index) => (
                  <Fragment key={index}>
                    {line.replace("<br>", "")}
                    <br />
                  </Fragment>
                ))}
              </p>
            </div>
          )
        })}
      </div>
      <div className="absolute bottom-0 left-0 right-0 px-4 py-2 w-full flex flex-row">
        <input
          value={userCommand}
          onChange={(e) => setUserCommand(e.target.value)}
          type="text" aria-multiline
          placeholder="What's your next move?"
          className="input w-full px-6 mr-2" />
        {/* <button onClick={() => generateImage()} className={`btn btn-circle`}>
          Save Image
        </button> */}
        <button onClick={takeAction} className={`btn btn-circle`}>
          {
            loading ?
              <span className="loading loading-spinner"></span> : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
          }
        </button>
      </div>
    </div>
  </div>
}

export default Gameplay
