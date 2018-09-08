const colors = ['red','blue','yellow','green','purple','orange','pink','teal',
                'lightblue','lightgreen'];
const i = max => Math.floor(Math.random() * Math.floor(max));
const c = () => colors[i(colors.length)];


const levelOne = () => {
    let blocks = [];

    for (let x = 50; x < 450; x += 20)
        for (let y = 200; y < 450; y += 20)
            blocks.push({
               height:15,
               width:15,
               color:c(),
               bottom:y,
               left:x,
            });
    return blocks;
};
const levelTwo = () => {
    let blocks = [];
    for (let y = 150; y < 500; y += 50)
        for(let x = 0; x < 500; x += 50)
            blocks.push({
                height:50,
                width:50,
                color:c(),
                bottom:y,
                left:x
            });
    return blocks;
};
const levelThree = () => {
    let blocks = [];
    for (let y = 180; y < 440; y += 80)
        for (let x = 30; x < 450; x += 40)
            blocks.push({
                height:30,
                width:30,
                color:c(),
                bottom:y,
                left:x
            });
    for (let y = 140; y < 440; y += 80)
        for (let x = 33; x < 420; x += 75)
            blocks.push({
                height:30,
                width:50,
                color:'black',
                bottom:y,
                left:x,
                unbreakable:true
            });
    return blocks
};


const levelFour = () => {
    let blocks = [];
    for (let i = 100; i < 470; i += 20) {
        blocks.push({
            height: 10,
            width: 10,
            color: c(),
            bottom: i,
            left: i,
            unbreakable: true
        });
        blocks.push({
            height: 10,
            width: 10,
            color: c(),
            bottom: i + 20,
            left: i - 20,
            unbreakable: true
        });
        blocks.push({
            height: 5,
            width: 5,
            color: c(),
            bottom: i - 40,
            left: i + 40,
            unbreakable: true
        });

    }
    return blocks;
};



const levels = [

    levelOne(),
    levelTwo(),
    levelThree(),
    levelFour(),


    levelOne(), levelTwo(), levelThree(), levelFour(),
    levelOne(), levelTwo(), levelThree(), levelFour(),
    levelOne(), levelTwo(), levelThree(), levelFour(),
    levelOne(), levelTwo(), levelThree(), levelFour(),
    levelOne(), levelTwo(), levelThree(), levelFour(),
    levelOne(), levelTwo(), levelThree(), levelFour(),
    levelOne(), levelTwo(), levelThree(), levelFour(),
    levelOne(), levelTwo(), levelThree(), levelFour(),
    levelOne(), levelTwo(), levelThree(), levelFour(),

];

module.exports = levels;