const Nodegeocoder=require("node-geocoder")

const options={
    provider:process.env.GEOCODER_PROVIDER,
    apiKey:process.env.GEOCODER_KEY,
    httpAdapter:"https",
    formatter:null
}

const geocoder=Nodegeocoder(options)

module.exports=geocoder

