import { Fragment, useEffect, useRef, useState } from "react"
import { continueStory, createImage, createImagePrompt, startNewStory } from "../helper/story"
import { ChatMessage, Colors } from '../helper/types'
import useStoryStore from "../redux/store"
import { Midjourney } from "midjourney";
import { imageUrlToBase64 } from "../helper/util";


const Gameplay = () => {

  const { baseline, setBaseline } = useStoryStore()

  const [conversation, setConversation] = useState<ChatMessage[]>([])
  const [base64Image, setBase64Image] = useState('')
  const [colors, setColors] = useState<Colors>()

  const [userCommand, setUserCommand] = useState('')

  const [loading, setLoading] = useState(false)

  const divRef = useRef(null);

  useEffect(() => {
    const startGame = async () => {
      setLoading(true)
      const story = await startNewStory()
      setLoading(false)
      setBaseline({ title: story.title, summary: story.summary, message: story.message })
      setColors(story.colors)
    }

    if (baseline.title == '' && baseline.message == '' && !loading)
      startGame()
  }, [])

  const scrollToBottom = () => {
    if (divRef.current) {
      (divRef.current as any).scrollTop = (divRef.current as any).scrollHeight;
    }
  };

  const takeAction = async () => {
    if (userCommand.trim() == "") return;

    const userRequest = {
      role: 'user',
      content: userCommand
    }

    const msgs = [{
      role: 'assistant',
      content: baseline.summary ?? '',
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
    scrollToBottom()
  }

  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      takeAction();
    }
  };

  const mintNFT = () => {

  }

  const generateImage = async () => {
    const userRequest = {
      role: 'user',
      content: `Create description for the scene of this story. You must include a subject (the main focus of the visual), what the subject is doing, where, and how, along with additional descriptive words to describe the rendering's visual style, environment, weather, lighting, etc. And the description should be concise in a paragraph while capturing all the details about the surroundings to incorporate in the picture based on this story plot. You must mention all the important artifacts.  
      ensure that you show the character in the image engaging with items or doing what exactly presented in the story. Don't mention any names but always present about the main or side characters i.e. subjects.`
    }

    const msgs = [{
      role: 'assistant',
      content: baseline.message ?? '',
    }, ...conversation, userRequest]

    setUserCommand('')
    setLoading(true)

    const response = await createImagePrompt(msgs)

    console.log(response)

    if (response) {
      const data = await createImage('digital artwork for ' + response)
      console.log(data)

      if (data) {
        setBase64Image(data);
        (window as any).nft_modal.showModal()
      }
    }

    setLoading(false)
  }

  return <div className="flex flex-col flex-1 w-2/3 py-12 h-full">
    <div className="relative rounded-lg bg-white bg-opacity-20 backdrop-blur-3xl border-white flex flex-col flex-1 mb-2 max-h-[80vh]">
      <div ref={divRef} className="overflow-y-auto overflow-x-hidden mb-16">
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
            <div key={i.content.slice(0, 10)} className={"h-auto mx-4 mb-4 rounded-lg p-4 " + (i.role == "user" ? "bg-accent" : "bg-white")}>
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
          onKeyPress={handleKeyPress}
          onChange={(e) => setUserCommand(e.target.value)}
          type="text" aria-multiline
          placeholder="What's your next move?"
          className="input w-full px-6 mr-2" />

        <button onClick={takeAction} className={`btn btn-circle`}>
          {
            loading ?
              <span className="loading loading-spinner"></span> : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
          }
        </button>

        <button onClick={() => conversation.length > 1 ? generateImage() : {}} className={`btn btn-rounded ml-2`}>
          Mint <img src="./nft.svg" className="h-6 w-6" />
        </button>
      </div>
    </div>
    <dialog id="nft_modal" className="modal">
      <form method="dialog" className="modal-box flex flex-1 flex-col justify-center items-center">
        <h1 className="">{baseline.title}</h1>
        <div className="flex flex-1 flex-col justify-center items-center">
          <img className="w-96 h-96 rounded-md" src={base64Image} alt="NFT Image" />
          <div className="text-left px-4">
            <p className="py-2 max-lines-4">{baseline.summary}</p>
          </div>
        </div>

        <div className="mt-2">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn mr-2">Close</button>
          <button onClick={mintNFT} className="btn btn-accent">Mint NFT</button>
        </div>
      </form>
    </dialog>
  </div>
}

export default Gameplay
