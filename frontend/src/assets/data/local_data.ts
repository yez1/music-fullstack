export const footerLinks = [
    {
        title:'服务条款',
        link:'https://st.music.163.com/official-terms/service'
    },
    {
        title:'隐私政策',
        link:'https://st.music.163.com/official-terms/privacy'
    },
    {
        title:'儿童隐私政策',
        link:'https://st.music.163.com/official-terms/children'
    },
    {
        title:'版权投诉指引',
        link:'https://music.163.com/st/staticdeal/complaints.html'
    }
]

export const footerImages = [
    {
        link: 'https://music.163.com/st/userbasic#/auth'
    },
    {
        link: 'https://music.163.com/recruit'
    },
    {
        link: 'https://music.163.com/web/reward'
    },
    {
        link: 'https://music.163.com/uservideo#/plan'
    }
]

//discover中数据
export const discoverMenu = [
    {
        title: '推荐',
        link: '/discover/recommend'
    },
    {
        title: '排行榜',
        link: '/discover/ranking'
    },
    {
        title: '歌单',
        link: '/discover/songs'
    },
    {
        title: '主播电台',
        link: '/discover/djradio'
    },
    {
        title: '歌手',
        link: '/discover/artist'
    },
    {
        title: '新碟上架',
        link: '/discover/album'
    }
]




export const artistCategories = [
    {
        title:'推荐',
        area:-1,
        aretists:[
            {
                name:'推荐歌手',
                type:1,
                url:'/discover/artist',
                id:0
            },
            {
                name:'入驻歌手',
                type:2,
                url:'/discover/artist?cat=5001',
                datePath:'/artist/list?cat=5001'
            }
        ]
    },
    {
        title:'华语',
        area:7,
        aretists:[
            {
                name:'华语男歌手',
                type:1,
                url:'/discover/artist?cat=1001',
                datePath:'/artist/list?cat=1001'
            },
            {
                name:'华语女歌手',
                type:2,
                url:'/discover/artist?cat=1002',
                datePath:'/artist/list?cat=1002'
            },
            {
                name:'华语组合/乐队',
                type:3,
                url:'/discover/artist?cat=1003',
                datePath:'/artist/list?cat=1003'
            }
        ]
    },
    {
        title:'欧美',
        area:96,
        aretists:[
            {
                name:'欧美男歌手',
                type:1,
                url:'/discover/artist?cat=1001',
                datePath:'/artist/list?cat=1001'
            },
        ]
    },
    {
        title:'日本',
        area:8,
        aretists:[
            {
                name:'日本男歌手',
                type:1,
                url:'/discover/artist?cat=1001',
                datePath:'/artist/list?cat=1001'
            },
            {
                name:'日本女歌手',
                type:2,
                url:'/discover/artist?cat=1002',
                datePath:'/artist/list?cat=1002'
            },
            {
                name:'日本组合/乐队',
                type:3,
                url:'/discover/artist?cat=1003',
                datePath:'/artist/list?cat=1003'
            }
        ]
    },
    {
        title:'韩国',
        area:16,
        aretists:[
            {
                name:'韩国男歌手',
                type:1,
                url:'/discover/artist?cat=1001',
                datePath:'/artist/list?cat=1001'
            },
            {
                name:'韩国女歌手',
                type:2,
                url:'/discover/artist?cat=1002',
                datePath:'/artist/list?cat=1002'
            },
            {
                name:'韩国组合/乐队',
                type:3,
                url:'/discover/artist?cat=1003',
                datePath:'/artist/list?cat=1003'
            }
        ]
    }
]

//热门主播
export const hotRadios = [
    {
        picUrl:'http://p2.music.126.net/H3QxWdf0eUiwmhJvA4vrMQ==/1407374893913311.jpg',
        name:'陈立',
        position:'心理学家、美食家陈立教授',
        url:'/user/home?id=278438485'
    },
    {
        picUrl:'http://p2.music.126.net/GgXkjCzeH4rqPCsrkBV1kg==/109951164843970584.jpg',
        name:'DJ艳秋',
        position:'著名音乐节目主持人',
        url:'/user/home?id=278438485'
    },
    {
        picUrl:'http://p2.music.126.net/RJNdt11mh-t74HLtv7vAgw==/109951172077610908.jpg',
        name:'国家大剧院',
        position:'古典音乐频道',
        url:'/user/home?id=278438485'
    },
    {
        picUrl:'http://p2.music.126.net/NHjNoFpLDEZ-3OR9h35z1w==/109951165825466770.jpg',
        name:'谢谢收听',
        position:'感谢聆听，南京电台主持人王馨',
        url:'/user/home?id=278438485'
    },
    {
        picUrl:'http://p2.music.126.net/mMZvNruOjEa4XNL6-lWjNg==/109951168919647064.jpg',
        name:'DJ晓苏',
        position:'华语歌坛常青树',
        url:'/user/home?id=278438485'
    }
]