import { ProductItem, createProductItem } from "@/lib/types/product";

export const productItems: ProductItem[] = [
    createProductItem({
        id: "1",
        title: "미니 파우치",
        image: "/items/IMG_1.jpeg",
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
                x: "43%", y: "52%",
                icon: "/tags/tag_four_leaf_colver.svg",
                label: "미니 파우치",
                link: "https://hottracks.kyobobook.co.kr/ht/gift/detail/2310058469765",
                labelX: "48%",
                labelY: "72%",
                color: "black",
                bgColor: "rgba(255,255,255,0.3)"
            },
        ],
        products: [
            {
                name: "[프롬디얼리던] 라이트 사각 미니 파우치",
                price: "9,500원",
                link: "https://hottracks.kyobobook.co.kr/gift/detail/S000216231683",
                description: "구매 링크 가기"
            },
            {
                name: "[다이소] 케어베어 스트랩",
                price: "1,000원",
                link: "https://www.daisomall.co.kr/pd/pdr/SCR_PDR_0001?pdNo=1039952&recmYn=N",
                description: "구매 링크 가기"
            },
        ]
    }),
    createProductItem({
        id: "2",
        title: "러쉬고체향수",
        image: "/items/IMG_2.jpeg",
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
        ],
        products: [
            {
                name: "[러쉬] 카마 솔리드 퍼퓸",
                price: "30,000원",
                link: "https://www.lush.co.kr/m/products/view/273?giftYn=Y&dc=",
                description: "시트러스 + 우디 향을 좋아한다면 강추 💚 | 구매 링크 가기"
            },
        ]
    }),
    createProductItem({
        id: "3",
        title: "키링",
        image: "/items/IMG_3.jpeg",
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
        ],
        products: [
            {
                name: "[플레이인더박스] 스타필드 수원점 4F",
                price: "6,000 ~ 15,000원",
                link: "https://map.naver.com/p/search/%ED%94%8C%EB%A0%88%EC%9D%B4%EC%9D%B8%EB%8D%94%EB%B0%95%EC%8A%A4/place/1216420426?placePath=/home?entry=pll&from=map&fromPanelNum=2&timestamp=202508200142&locale=ko&svcName=map_pcv5&searchText=%ED%94%8C%EB%A0%88%EC%9D%B4%EC%9D%B8%EB%8D%94%EB%B0%95%EC%8A%A4&fromNxList=true&searchType=place&c=15.00,0,0,0,dh",
                description: "네이버 플레이스 추가하러 가기"
            },
        ]
    }),
];

