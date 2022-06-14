export interface animeme_from_reddit {
  data: {
    url: string;
    id: string;
    author: string;
    title: string;
  };
}

export interface animeme_in_json {
  [id: string]: {
    url: string;
    author: string;
    title: string;
  };
}

export interface animeme_to_insta {
  url: string;
  author: string;
  title: string;
}
