export const formattedDate = (data) => {
    return new Date(data).toLocaleDateString().replace("en-US",{
        month : "long",
        day : "numeric",
        year : "numeric"
    } )
}