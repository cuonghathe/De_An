import { useEffect, useState } from "react";

const Scrolling = ({ scrollToInstructions, scrollToReviews, scrollToIngredients, handleAddServing, handleRemoveServing, changeOpacity }) => {
  const [, setCommandLog] = useState([]);
  const [lastExecuted, setLastExecuted] = useState(0);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const maxScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    if (!SpeechRecognition) {
      console.error("Trình duyệt không hỗ trợ SpeechRecognition");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "vi-VN";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      console.log(".");
    };

    let isRecognitionStarted = false;

    recognition.onerror = (event) => {
      if (event.error === "no-speech") {
        console.log("FUCK!!! Retrying...");
        setTimeout(() => {
          if (!isRecognitionStarted) {
            try {
              recognition.start();
            } catch (error) {
              console.error("FUCK!!!:", error);
            }
          }
        }, 1000);
      }
      console.error("Speech recognition error:", event.error);
    };

    recognition.onresult = (event) => {
      const command = event.results[event.results.length - 1][0].transcript.trim();
      console.log("Command received:", command);

      const currentTime = Date.now();
      if (currentTime - lastExecuted > 2000) {
        setCommandLog((prevLog) => [...prevLog, command]);

        if (command === "kéo lên" || command === "lên" || command === "cuộn lên") {
          window.scrollBy(0, -150);
        } else if (command === "kéo xuống" || command === "xuống" || command === "cuộn xuống") {
          window.scrollBy(0, 150);
        } else if (command === "xuống lửa" || command === "lửa") {
          window.scrollBy(0, document.body.scrollHeight / 2);
        }
        else if (command === "xuống cuối" || command === "cuối" || command === "cuối trang") {
          window.scrollTo(0, maxScroll);
        }
        else if (command === "lên đầu" || command === "đầu" || command === "đầu trang") {
          window.scrollTo(0, 0);
        }

        else if (command === "hai" || command === "4" || command === "hài") {
          scrollToInstructions();
        }

        else if (command === "ba" || command === "3") {
          scrollToReviews();
        }

        else if (command === "một" || command === "1") {
          scrollToIngredients();
        }

        else if (command === "tăng") {
          handleAddServing();
        }

        else if (command === "giảm") {
          handleRemoveServing();
        }

        else if (command === "tắt" || command === "bật") {
          changeOpacity();
        }

        setLastExecuted(currentTime);
      }
    };



    try {
      recognition.start();
    } catch (error) {
      console.error("Lỗi khi khởi động SpeechRecognition:", error);
    }

  }, [lastExecuted, scrollToInstructions, scrollToReviews, scrollToIngredients, handleAddServing, handleRemoveServing, changeOpacity]);



  return null;

};

export default Scrolling;
