export function formatCount(count:number){
    if(count > 1000000000){
        return (count / 100000000).toFixed(1) + '亿';
    }else if(count > 100000){
        return (count / 10000).toFixed(1) + '万';
    }else{
        return count;
    }
}

export function getImageSize(imageUrl:string,width:number,height:number=width){
    return imageUrl + '?param=' + width + 'y' + height;
}


export function formatTime(time:number){
    const minutes = Math.floor(time/60)
    const seconds = Math.floor(time%60)
    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`
}