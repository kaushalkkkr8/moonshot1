import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const MailDetail = () => {
  const [mailDetail, setMailDetail] = useState("");
  const location = useLocation();

  let { mailDetailimpData, data } = location.state;
  const [mailId, setMailId] = useState(null);
  const [mailData, setMailData] = useState(null);
  const [filter, setFilter] = useState("all");
  const [filterColor, setFilterColor] = useState("all");

  const [readMails, setReadMails] = useState(() => {
    const savedReadMails = sessionStorage.getItem("readMails");
    return savedReadMails ? JSON.parse(savedReadMails) : [];
  });

  const [favouriteMails, setFavouriteMails] = useState(() => {
    const savedFavourites = sessionStorage.getItem("favouriteMails");
    return savedFavourites ? JSON.parse(savedFavourites) : [];
  });

  useEffect(() => {
    if (mailDetailimpData?.id) {
      setMailData(mailDetailimpData);
      setMailId(mailDetailimpData.id);
    }
  }, [mailDetailimpData]);

  useEffect(() => {
    const fetchMailDetail = async () => {
      if (!mailId) return;

      try {
        const response = await fetch(`https://flipkart-email-mock.vercel.app/?id=${mailId}`);
        if (response.ok) {
          const result = await response.json();
          setMailDetail(result);
        } else {
          console.error("Failed to fetch mail details");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchMailDetail();
  }, [mailId]);

  const clickMailHandler = (id, subject, date, name) => {
    setMailData({ id, subject, date, name });
    setMailId(id);

    const updatedReadMails = [...readMails];
    if (!updatedReadMails.includes(id)) {
      updatedReadMails.push(id);
      setReadMails(updatedReadMails);

      sessionStorage.setItem("readMails", JSON.stringify(updatedReadMails));
    }
  };

  const toggleFavouriteHandler = (mailid) => {
    const updatedFavourites = [...favouriteMails];
    if (favouriteMails.includes(mailid)) {
      const index = updatedFavourites.indexOf(mailid);
      updatedFavourites.splice(index, 1);
    } else {
      updatedFavourites.push(mailid);
    }
    setFavouriteMails(updatedFavourites);
    sessionStorage.setItem("favouriteMails", JSON.stringify(updatedFavourites));
  };

  const isFavourite = favouriteMails.includes(mailId);
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
      <div style={{ background: "#F4f5f9" }}>
        <div className="container py-2">
  

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

          <div className="row">
            <div className="col-md-4">
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

                const isRead = readMails.includes(mail.id);
                const favorite = isFavorite(mail.id);

                return (
                  <div
                    className=" card mb-3 py-2"
                    key={mail.id}
                    style={{ cursor: "pointer", backgroundColor: isRead ? "#f2f2f2" : "white" }}
                    onClick={() => clickMailHandler(mail.id, mail.subject, formattedDate, mail.from.name)}
                  >
                    <div className="row">
                      <div className="col-md-3">
                        <div
                          className="text-white float-end mt-1"
                          style={{ background: "#E54065", borderRadius: "100%", width: "40px", height: "40px", display: "flex", justifyContent: "center", alignItems: "center" }}
                        >
                          <h5 style={{ margin: "0" }}>{mail.from.name[0]}</h5>
                        </div>
                      </div>
                      <div className="col-md-9">
                        <p>
                          <small style={{ fontSize: "12.5px", color: "#636363" }}>
                            {" "}
                            From:{" "}
                            <b>
                              {mail.from.name} &lt;{mail.from.email}
                              &gt;
                            </b>
                          </small>
                          <br />

                          <small style={{ fontSize: "13px", color: "#636363" }}>
                            Subject: <b>{mail.subject}</b>
                          </small>
                        </p>
                        <div style={{ display: "-webkit-box", WebkitLineClamp: "1", WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "normal" }}>
                          <small style={{ fontSize: "13px", color: "#636363" }}> {mail.short_description}</small>
                        </div>
                        <small style={{ fontSize: "13px", color: "#636363" }}>{formattedDate}</small> &nbsp;&nbsp;&nbsp;
                        {favorite && (
                          <small className="fw-bold" style={{ color: "#E54065" }}>
                            Favorite
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="col-md-8 ">
              <div className="card  ">
                <div className="card-body me-4">
                  <div className="row">
                    <div className="col-md-1 ">
                      <div
                        className="text-white  mt-1"
                        style={{ background: "#E54065", borderRadius: "100%", width: "40px", height: "40px", display: "flex", justifyContent: "center", alignItems: "center" }}
                      >
                        <h5 style={{ margin: "0" }}>{mailData?.name[0]}</h5>
                      </div>
                    </div>
                    <div className="col-md-11 mt-1">
                      <div className="row">
                        <h3 style={{ color: "#636363" }}>
                          {mailData?.subject}{" "}
                          <button
                            className="btn  float-end rounded-pill"
                            style={{
                              padding: "0.25rem 0.8rem",
                              fontSize: "0.75rem",
                              background: isFavourite ? "#E54065" : "white",
                              color: isFavourite ? "white" : "#E54065",
                              border: "1px solid #E54065",
                            }}
                            onClick={() => toggleFavouriteHandler(mailData?.id)}
                          >
                            Mark as Favorite
                          </button>
                        </h3>
                        <br />
                        <br />
                        <small style={{ color: "#636363" }}>{mailData?.date}</small>
                        <br />
                        <br />

                        <div>{mailDetail?.body ? <div dangerouslySetInnerHTML={{ __html: mailDetail.body }} style={{ color: "#636363" }}></div> : <p>Loading...</p>}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default MailDetail;
