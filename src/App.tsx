import { useEffect, useState } from "react";
import "./App.css";
import { gql, useSubscription, useQuery } from "@apollo/client";

const query = gql`
  {
    book {
      title
      author {
        name
      }
    }
  }
`;

const subscription = gql`
  subscription {
    onPublished {
      title
      author {
        name
      }
    }
  }
`;
type Book = {
  title: string;
  author: Author;
};

type Author = {
  name: string;
};

const App = () => {
  const [book, setBook] = useState<Book>({ title: "", author: { name: "" } });

  // handle errors + loading
  const { data: subscriptionData } = useSubscription(subscription);

  const { data: queryData } = useQuery(query);

  useEffect(() => {
    if (subscriptionData) {
      console.log(subscriptionData);
      setBook(subscriptionData.onPublished);
    }
  }, [subscriptionData]);

  useEffect(() => {
    if (queryData) {
      console.log(queryData);
      setBook(queryData.book);
    }
  }, [queryData]);

  return (
    <>
      <h1>Data</h1>
      <section className="data-container">
        <div className="row">
          <h2>Title</h2>
          <p>{book.title}</p>
        </div>
        <div className="row">
          <h2>Author</h2>
          <p>{book.author.name}</p>
        </div>
      </section>

      <p>{`Updated at ${new Date(Date.now()).toLocaleTimeString([], {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        fractionalSecondDigits: 3,
      })}`}</p>
    </>
  );
};

export default App;
