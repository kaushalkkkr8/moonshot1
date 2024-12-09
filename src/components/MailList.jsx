import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const MailList = () => {
  const [data, setData] = useState("");
  const [filter, setFilter] = useState("all");

  const [readMails, setReadMails] = useState(() => {
    const savedReadMails = sessionStorage.getItem("readMails");
    return savedReadMails ? JSON.parse(savedReadMails) : [];
  });

  const fetchAllMail = async () => {
    try {
      const response = await fetch("https://flipkart-email-mock.vercel.app/");

      if (response) {
        const data = await response.json();
        setData(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllMail();
  }, []);

  const handleMailClick = (mailId) => {
    const updatedReadMails = [...readMails];
    if (!updatedReadMails.includes(mailId)) {
      updatedReadMails.push(mailId);
      setReadMails(updatedReadMails);

      sessionStorage.setItem("readMails", JSON.stringify(updatedReadMails));
    }
  };

  const isFavorite = (mailId) => {
    const favoriteMails = JSON.parse(sessionStorage.getItem("favouriteMails")) || [];
    return favoriteMails.includes(mailId);
  };
  const filteredMails = data?.list?.filter((mail) => {
    const isRead = readMails.includes(mail.id);
    const isFav = isFavorite(mail.id);

    if (filter === "read") return isRead;
    if (filter === "unread") return !isRead;
    if (filter === "favourite") return isFav;
    return true;
  });

  return (
    <>
      <div className="container py-5">
      <div>
            <p>
              Filter By:{" "}
              <button
                type="button"
                className="mx-2 btn"
                onClick={() => setFilter("all")}
                style={{
                  border: `${filter === "all" ? "1px solid #E1E4EA" : ""}`,
                  backgroundColor: `${filter === "all" ? "#E1E4EA" : ""}`,
                   borderRadius: "50px"
                }}
              >
                All
              </button>
              <button
                type="button"
                className="me-3 btn"
                onClick={() => setFilter("unread")}
                style={{
                  border: `${filter === "unread" ? "1px solid #E1E4EA" : ""}`,
                  backgroundColor: `${filter === "unread" ? "#E1E4EA" : ""}`,
                   borderRadius: "50px"
                }}
              >
                Unread
              </button>
              <button
                type="button"
                className="me-2 btn"
                onClick={() => setFilter("read")}
                style={{
                  border: `${filter === "read" ? "1px solid #E1E4EA" : ""}`,
                  backgroundColor: `${filter === "read" ? "#E1E4EA" : ""}`,
                   borderRadius: "50px"
                }}
              >
                Read
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => setFilter("favourite")}
                style={{
                  border: `${filter === "favourite" ? "1px solid #E1E4EA" : ""}`,
                  backgroundColor: `${filter === "favourite" ? "#E1E4EA" : ""}`,
                  borderRadius: "50px"
                }}
              >
                Favourite
              </button>
            </p>
          </div>

        {filteredMails?.map((mail) => {
          const dateObject = new Date(mail.date);

          const day = dateObject.getDate().toString().padStart(2, "0");
          const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
          const year = dateObject.getFullYear();

          let hours = dateObject.getHours();
          const minutes = dateObject.getMinutes().toString().padStart(2, "0");
          const ampm = hours >= 12 ? "pm" : "am";

          hours = hours % 12 || 12;

          const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}${ampm}`;
          const mailDetailimpData = {
            id: mail.id,
            subject: mail.subject,
            date: formattedDate,
            name: mail.from.name,
          };
          const isRead = readMails.includes(mail.id);
          const favorite = isFavorite(mail.id);
          return (
            <>
              <Link to="/detail" state={{ mailDetailimpData, data }} style={{ textDecoration: "none" }}>
                <div className=" card mb-3 py-2" key={mail.id} style={{ cursor: "pointer", backgroundColor: isRead ? "#f2f2f2" : "white" }} onClick={() => handleMailClick(mail.id)}>
                  <div className="row">
                    <div className="col-md-1">
                      <div
                        className="text-white float-end mt-1"
                        style={{ background: "#E54065", borderRadius: "100%", width: "40px", height: "40px", display: "flex", justifyContent: "center", alignItems: "center" }}
                      >
                        <h5 style={{ margin: "0" }}>{mail.from.name[0]}</h5>
                      </div>
                    </div>
                    <div className="col-md-11">
                      <p>
                        <small style={{ fontSize: "13px", color: "#636363" }}>
                          {" "}
                          From:{" "}
                          <b>
                            {mail.from.name} &lt;{mail.from.email}
                          </b>
                          &gt;
                        </small>
                        <br />

                        <small style={{ fontSize: "13px", color: "#636363" }}>
                          Subject: <b>{mail.subject}</b>
                        </small>
                      </p>
                      <small style={{ fontSize: "13px", color: "#636363" }}> {mail.short_description}</small>
                      <br />
                      <small style={{ fontSize: "13px", color: "#636363" }}>{formattedDate}</small> &nbsp;&nbsp;&nbsp;
                      {favorite && (
                        <small className="fw-bold" style={{ color: "#E54065" }}>
                          Favorite
                        </small>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </>
          );
        })}
      </div>
    </>
  );
};
export default MailList;
