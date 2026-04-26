    let streak = 0;
    let currentUnit = "1";
    let questions = units[currentUnit];

    function formatText(text) {
      return text
        .replace(/\$(.*?)\$/g, '<span class="kanji">$1</span>')
        .replace(/#(.*?)#/g, '<span class="okurigana">$1</span>');
    }

    function renderQuestions(list) {
      const data = JSON.parse(localStorage.getItem("answers") || "{}");

      let html = "";

      list.forEach((q, index) => {
        const formatted = formatText(q.text);

        let mark = "";
        if (data[q.id] === true) {
          mark = "⭕";
        } else if (data[q.id] === false) {
          mark = "❌";
        }

        html += `
      <div>
        <p>${index + 1}. ${formatted} ${mark}</p>
        <button onclick="answer('${q.id}', true)">正解</button>
        <button onclick="answer('${q.id}', false)">不正解</button>
      </div>
    `;
      });

      document.getElementById("question").innerHTML = html;
    }

    function answer(id, result) {
      const data = JSON.parse(localStorage.getItem("answers") || "{}");

      data[id] = result;

      localStorage.setItem("answers", JSON.stringify(data));
      // ★ここ追加
      const resultDiv = document.getElementById("result");
      if (result) {
        resultDiv.innerHTML = "🔥 正解！";
        resultDiv.className = "correct";

        playEffect(); // ←ここ

      } else {
        resultDiv.innerHTML = "💥 不正解！";
        resultDiv.className = "wrong";
      }
      console.log(id, result);
      updateProgress();
      renderQuestions(questions);
    }

    if (result) {
      streak++;

      if (streak === 5) {
        resultDiv.innerHTML = "🎉 5連続！神！！";
        confetti({ particleCount: 200, spread: 180 });
      } else {
        playEffect();
      }

    } else {
      streak = 0;
    }


    function selectUnit(unit) {
      currentUnit = unit;
      questions = units[unit];
      renderQuestions(questions);
    }

    function showWeak() {
      const data = JSON.parse(localStorage.getItem("answers") || "{}");

      const weakQuestions = questions.filter(q => data[q.id] === false);

      renderQuestions(weakQuestions);
    }

    function showAll() {
      renderQuestions(questions);
    }
    function updateProgress() {
      const data = JSON.parse(localStorage.getItem("answers") || "{}");

      const total = questions.length;
      let answered = 0;

      questions.forEach(q => {
        if (data[q.id] !== undefined) {
          answered++;
        }
      });

      const percent = Math.floor((answered / total) * 100);

      document.getElementById("progress").innerHTML =
        `<div id="progress-bar" style="width:${percent}%">${answered}/${total}</div>`;
    }
    function playEffect() {
      const effects = [effectBurst, effectSideShot, effectBig];
      const fn = effects[Math.floor(Math.random() * effects.length)];
      fn();
    }
    function effectBurst() {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }

    function effectSideShot() {
      confetti({ particleCount: 40, angle: 60, spread: 80 });
      confetti({ particleCount: 40, angle: 120, spread: 80 });
    }

    function effectBig() {
      confetti({ particleCount: 120, spread: 120, startVelocity: 45 });
    }
    // 初期表示
    renderQuestions(questions);
    updateProgress();
