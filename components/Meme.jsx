import React from "react"

export default function Meme() {
    const [meme, setMeme] = React.useState({
        topText: "",
        bottomText: "",
        randomImage: "http://i.imgflip.com/1bij.jpg" 
    })
    const [allMemes, setAllMemes] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState(null)
    
    React.useEffect(() => {
        async function fetchMemes() {
            try {
                setIsLoading(true)
                setError(null)
                const response = await fetch("https://api.imgflip.com/get_memes")
                if (!response.ok) {
                    throw new Error('Failed to fetch memes')
                }
                const data = await response.json()
                setAllMemes(data.data.memes)
            } catch (err) {
                setError(err.message)
            } finally {
                setIsLoading(false)
            }
        }
        fetchMemes()
    }, [])
    
    function getMemeImage() {
        if (!allMemes.length) return
        const randomNumber = Math.floor(Math.random() * allMemes.length)
        const url = allMemes[randomNumber].url
        setMeme(prevMeme => ({
            ...prevMeme,
            randomImage: url
        }))
    }
    
    function handleChange(event) {
        const {name, value} = event.target
        setMeme(prevMeme => ({
            ...prevMeme,
            [name]: value
        }))
    }
    
    return (
        <main>
            <div className="form">
                <input 
                    type="text"
                    placeholder="Top text"
                    className="form--input"
                    name="topText"
                    value={meme.topText}
                    onChange={handleChange}
                />
                <input 
                    type="text"
                    placeholder="Bottom text"
                    className="form--input"
                    name="bottomText"
                    value={meme.bottomText}
                    onChange={handleChange}
                />
                <input 
                    type="url"
                    placeholder="Image URL"
                    className="form--input url"
                    name="randomImage"
                    value={meme.randomImage}
                    onChange={handleChange}
                />
                <button 
                    className="form--button"
                    onClick={getMemeImage}
                    disabled={isLoading || error}
                >
                    {isLoading ? "Loading..." : "Get a new meme image 🪄"}
                </button>
            </div>
            {error && <p className="error-message">Error: {error}</p>}
            <div className="meme">
                <img 
                    src={meme.randomImage} 
                    className="meme--image" 
                    alt="Current meme"
                    onError={(e) => {
                        e.target.onerror = null
                        setError("Failed to load image")
                    }}
                />
                <h2 className="meme--text top">{meme.topText}</h2>
                <h2 className="meme--text bottom">{meme.bottomText}</h2>
            </div>
        </main>
    )
}