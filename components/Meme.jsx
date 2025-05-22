import React from "react"

export default function Meme() {
    const [meme, setMeme] = React.useState({
        topText: "",
        bottomText: "",
        randomImage: "https://mediadatabase.cdn.bugatti-newsroom.com/d/YZiKD3Ea/" 
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
    
    function handleDownload() {
        const memeContainer = document.querySelector(".meme")
        if (!memeContainer) return
        
        // Create a canvas element
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        
        // Create a new image to get the actual dimensions
        const img = new Image()
        img.crossOrigin = "anonymous"  // Enable cross-origin image loading
        img.src = meme.randomImage
        
        img.onload = () => {
            // Set canvas dimensions to match the image
            canvas.width = img.width
            canvas.height = img.height
            
            // Draw the image
            ctx.drawImage(img, 0, 0)
            
            // Configure text style
            ctx.fillStyle = "white"
            ctx.strokeStyle = "black"
            ctx.lineWidth = Math.min(8, Math.max(2, img.width * 0.004))  // Responsive stroke width with min/max limits
            ctx.font = `${img.height * 0.1}px impact`  // Responsive font size
            ctx.textAlign = "center"
            
            // Add top text
            if (meme.topText) {
                ctx.fillText(meme.topText.toUpperCase(), img.width / 2, img.height * 0.1)
                ctx.strokeText(meme.topText.toUpperCase(), img.width / 2, img.height * 0.1)
            }
            
            // Add bottom text
            if (meme.bottomText) {
                ctx.fillText(meme.bottomText.toUpperCase(), img.width / 2, img.height * 0.9)
                ctx.strokeText(meme.bottomText.toUpperCase(), img.width / 2, img.height * 0.9)
            }
            
            // Create download link
            const link = document.createElement("a")
            link.download = "my-meme.png"
            link.href = canvas.toDataURL("image/png")
            link.click()
        }
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
                <button 
                    className="form--button download-button"
                    onClick={handleDownload}
                    disabled={isLoading || error}
                >
                    Download Meme 💾
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