import { FoodItem } from "./types";

export const foodItems: FoodItem[] = [
    {
        id: 1,
        type: "음식",
        title: "터프이너프 로스터스",
        image: "/items/IMG_6164.jpeg",
        format: "음식점",
        link: "https://map.naver.com/p/entry/place/37489082?c=15.00,0,0,0,dh&placePath=/home?from=map&from=map&fromPanelNum=1&additionalHeight=76&timestamp=202508211052&locale=ko&svcName=map_pcv5&fromPanelNum=1&additionalHeight=76&timestamp=202508211052&locale=ko&svcName=map_pcv5",
        description: "🥖🍞👍",
        location: "경기 평택시",
    },
    {
        id: 2,
        type: "음식",
        title: "수육",
        image: "/items/IMG_4.jpeg",
        format: "레시피",
        cookTime: "총 조리 시간 약 45분",
        ingredients: "앞다리살(or 삼겹살), 된장, 양파, 마늘",
        steps: [
            "돼지고기 초벌하고 (선택 ✅)",
            "🔥 끓는 물에 모든 재료를 10분 삶다가",
            "35분 이상 약중불에서 삶고 먹기",
        ],
    },
    {
        id: 3,
        type: "음식",
        title: "태리주택",
        image: "/items/IMG_6614.jpeg",
        format: "음식점",
        link: "https://map.naver.com/p/entry/place/1893730852?lng=127.0119844&lat=37.285308&placePath=/home?from=map&fromPanelNum=1&additionalHeight=76&timestamp=202508211030&locale=ko&svcName=map_pcv5&entry=plt&searchType=place&c=15.00,0,0,0,dh",
        description: "🍝👍",
        location: "경기 수원시",
    },
    {
        id: 4,
        type: "음식",
        title: "브뤼셀프라이",
        image: "/items/IMG_6552.jpeg",
        format: "음식점",
        link: "https://map.naver.com/p/search/%EB%B8%8C%EB%A4%BC%EC%85%80%ED%94%84%EB%9D%BC%EC%9D%B4%20KT%EC%9C%84%EC%A6%88%ED%8C%8C%ED%81%AC%EC%A0%90/place/1314225665?c=15.00,0,0,0,dh&isCorrectAnswer=true&placePath=/home?from=map&fromPanelNum=1&additionalHeight=76&timestamp=202508211032&locale=ko&svcName=map_pcv5&searchText=%EB%B8%8C%EB%A4%BC%EC%85%80%ED%94%84%EB%9D%BC%EC%9D%B4%20KT%EC%9C%84%EC%A6%88%ED%8C%8C%ED%81%AC%EC%A0%90",
        description: "🍟👍👍",
        location: "경기 수원시",
    },
];