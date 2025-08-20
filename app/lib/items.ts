import { Item } from "./types";

export const items: Item[] = [
    { id: 1,
        type: "상품",  title: "미니 파우치", image: "/items/IMG_1.jpeg",
        tags: [
            {
                x: "15%", y: "10%",
                icon: "/tags/tag_heart_pin_right.svg",
                label: "스트랩",
                link: "https://www.daisomall.co.kr/pd/pdr/SCR_PDR_0001?pdNo=1039952&recmYn=N",
                labelX: "25%",
                labelY: "70%",
                color: "white",
                bgColor: "rgba(0,0,0,0.2)"
            },
            {
                x: "48%", y: "54%",
                icon: "/tags/tag_four_leaf_colver.svg",
                label: "미니 파우치",
                link: "https://hottracks.kyobobook.co.kr/ht/gift/detail/2310058469765",
                labelX: "48%",
                labelY: "72%",
                color: "black",
                bgColor: "rgba(255,255,255,0.3)"
            },
        ],
    },
    { id: 2, type: "음식",  title: "김밥천국", description: "가성비 최고 김밥/라면", location: "서울 강남구" },
    { id: 3, type: "레시피", title: "김치찌개", description: "돼지고기+김치 보글보글" },
    { id: 4,
        type: "상품",  title: "러쉬고체향수", image: "/items/IMG_2.jpeg",
        tags: [
            {
                x: "60%", y: "35%",
                icon: "/tags/tag_heart_pin_right.svg",
                label: "카마 솔리드 퍼퓸",
                link: "https://www.lush.co.kr/m/products/view/273?giftYn=Y&dc=",
                labelX: "28%",
                labelY: "73%",
                color: "black",
                bgColor: "rgba(255,255,255,0.3)"
            }
        ]
    },
    { id: 5,
        type: "상품",  title: "키링", image: "/items/IMG_3.jpeg",
        tags: [
            {
                x: "55%", y: "25%",
                icon: "/tags/tag_red_pin.svg",
                label: "플레이인더박스",
                link: "https://map.naver.com/p/search/%ED%94%8C%EB%A0%88%EC%9D%B4%EC%9D%B8%EB%8D%94%EB%B0%95%EC%8A%A4/place/1216420426?placePath=/home?entry=pll&from=map&fromPanelNum=2&timestamp=202508200142&locale=ko&svcName=map_pcv5&searchText=%ED%94%8C%EB%A0%88%EC%9D%B4%EC%9D%B8%EB%8D%94%EB%B0%95%EC%8A%A4&fromNxList=true&searchType=place&c=15.00,0,0,0,dh",
                labelX: "49%",
                labelY: "49%",
                color: "white",
                bgColor: "rgba(0,0,0,0.2)"
            }
        ]
    },
];

