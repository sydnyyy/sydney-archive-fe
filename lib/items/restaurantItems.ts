import { Item, CATEGORY, ITEM_TYPE } from "@/lib/types/item/item";

export const restaurantItems: Item[] = [
    {
        id: "5",
        category: CATEGORY.FOOD,
        type: ITEM_TYPE.RESTAURANT,
        title: "터프이너프 로스터스",
        images: [
            "/items/IMG_6164.jpeg",
        ],
        products: [
            {
                name: "[경기 평택] 터프이너프 로스터스",
                link: "https://map.naver.com/p/entry/place/37489082?c=15.00,0,0,0,dh&placePath=/home?from=map&from=map&fromPanelNum=1&additionalHeight=76&timestamp=202508211052&locale=ko&svcName=map_pcv5&fromPanelNum=1&additionalHeight=76&timestamp=202508211052&locale=ko&svcName=map_pcv5",
                description: "네이버 플레이스 추가하러 가기"
            },
        ],
    },
    {
        id: "6",
        category: CATEGORY.FOOD,
        type: ITEM_TYPE.RESTAURANT,
        title: "태리주택",
        images: [
            "/items/IMG_6614.jpeg",
        ],
        products: [
            {
                name: "[경기 수원] 태리주택",
                link: "https://map.naver.com/p/entry/place/1893730852?lng=127.0119844&lat=37.285308&placePath=/home?from=map&fromPanelNum=1&additionalHeight=76&timestamp=202508211030&locale=ko&svcName=map_pcv5&entry=plt&searchType=place&c=15.00,0,0,0,dh",
                description: "네이버 플레이스 추가하러 가기"
            },
        ],
    },
    {
        id: "7",
        category: CATEGORY.FOOD,
        type: ITEM_TYPE.RESTAURANT,
        title: "브뤼셀프라이",
        images: [
            "/items/IMG_6552.jpeg",
        ],
        products: [
            {
                name: "[경기 수원] 브뤼셀프라이",
                link: "https://map.naver.com/p/search/%EB%B8%8C%EB%A4%BC%EC%85%80%ED%94%84%EB%9D%BC%EC%9D%B4%20KT%EC%9C%84%EC%A6%88%ED%8C%8C%ED%81%AC%EC%A0%90/place/1314225665?c=15.00,0,0,0,dh&isCorrectAnswer=true&placePath=/home?from=map&fromPanelNum=1&additionalHeight=76&timestamp=202508211032&locale=ko&svcName=map_pcv5&searchText=%EB%B8%8C%EB%A4%BC%EC%85%80%ED%94%84%EB%9D%BC%EC%9D%B4%20KT%EC%9C%84%EC%A6%88%ED%8C%8C%ED%81%AC%EC%A0%90",
                description: "네이버 플레이스 추가하러 가기"
            },
        ],
    },
];