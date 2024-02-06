const generateForm = document.querySelector<HTMLFormElement>('.generate-form');
const imageGallery = document.querySelector<HTMLDivElement | any>('.image-gallery')

const OPENAI_API_KEY = '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';
let isImageGenerating = false; 

const updateImageCard = (imgDataArray:any) => {
imgDataArray.forEach((imgObject:any, index:number) => {
    const imgCard = imageGallery.querySelectorAll(".img-card")[index];
    const imgElement = imgCard.querySelector('img');
    const downloadBtn = imgCard.querySelector('.download-btn')

    const aiGeneratedImg = `data:image/jpeg;base64, ${imgObject.b64_json}`
    imgElement.src = aiGeneratedImg

imgElement.onload = () => {
    imgCard.classList.remove("loading");
    downloadBtn.setAttribute('href', aiGeneratedImg)
    downloadBtn.setAttribute('download', `${new Date().getTime()}.jpg`)

}

});
}

const generateAiImages = async(userPrompt:string, userImgQuantity:any) => {
 try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: "POST",
        headers:{
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            prompt: userPrompt,
            n: parseInt(userImgQuantity),
            size: '512x512',
            response_format: "b64_json"
        })
    })
if(!response.ok) throw new Error ("Failed to generate images, Please try again.")
    const {data} = await response.json();
    updateImageCard([...data])
 } catch (error:any) {
    alert(error.message)
 } finally{
    isImageGenerating = false
 }
}

const handleFormSubmission = (e: Event) => {
    e.preventDefault();

    if(isImageGenerating) return;
    isImageGenerating = true;

    const form = e.target as HTMLFormElement | any;
    const userPrompt = form.elements[0].value as string;
    const userImgQuantity = form.elements[1].value as number;

    const imgCardMarkup = Array.from({length: userImgQuantity}, () => 
    `
    <div class="img-card loading">
				<img src='./src/assests/loader.svg' alt="image" />
				<a href="#" class="download-btn">
					<img src='./src/assests/download.svg' alt="download-icon" />
				</a>
			</div>
    `
    
    ).join('');

    imageGallery.innerHTML = imgCardMarkup;
    generateAiImages(userPrompt, userImgQuantity);
    
}

generateForm?.addEventListener('submit', handleFormSubmission);
