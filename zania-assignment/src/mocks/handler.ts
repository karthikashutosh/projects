import { http, HttpResponse } from "msw";
import { CatDataType } from "../types";

const getStorageData = (key: string): CatDataType[] | null => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const setStorageData = (key: string, data: CatDataType[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

const initializeStorage = (): void => {
  if (!getStorageData("cats")) {
    const defaultData: CatDataType[] = [
      {
        type: "bank-draft",
        title: "Bank Draft",
        position: 0,
        imgUrl:
          "https://www.catster.com/wp-content/uploads/2017/08/A-fluffy-cat-looking-funny-surprised-or-concerned.jpg",
      },
      {
        type: "bill-of-lading",
        title: "Bill of Lading",
        position: 1,
        imgUrl:
          "https://www.petmd.com/sites/default/files/petmd-cat-happy-13.jpg",
      },
      {
        type: "invoice",
        title: "Invoice",
        position: 2,
        imgUrl:
          "https://www.catster.com/wp-content/uploads/2017/08/Pixiebob-cat.jpg",
      },
      {
        type: "bank-draft-2",
        title: "Bank Draft 2",
        position: 3,
        imgUrl: "https://i.ytimg.com/vi/YCaGYUIfdy4/maxresdefault.jpg",
      },
      {
        type: "bill-of-lading-2",
        title: "Bill of Lading 2",
        position: 4,
        imgUrl:
          "https://img-aws.ehowcdn.com/600x600p/photos.demandstudios.com/getty/article/165/76/87490163.jpg",
      },
    ];
    setStorageData("cats", defaultData);
  }
};

initializeStorage();

export const handlers = [
  // GET all items
  http.get("/api/cats", () => {
    const items = getStorageData("cats");
    return HttpResponse.json(items);
  }),

  // POST to update cat data
  http.post("/api/cats", async ({ request }) => {
    let items = getStorageData("cats") || [];
    let body: Partial<CatDataType>[];

    try {
      body = (await request.json()) as Partial<CatDataType>[];
    } catch {
      body = [];
    }

    if (Array.isArray(body) && body.length > 0) {
      items = items.map((item) => {
        const updatedItem = body.find(
          (bodyItem) => bodyItem.position === item.position
        );
        return updatedItem ? { ...item, ...updatedItem } : item;
      });
    }

    setStorageData("cats", items);
    return HttpResponse.json(items, { status: 200 });
  }),
];
