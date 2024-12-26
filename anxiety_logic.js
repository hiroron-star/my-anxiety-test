/************************************************************
 * script.js
 * (1) ボタンで下部へスクロール
 * (2) 質問カード生成
 * (3) 回答を集計して表示
 ************************************************************/

// (1) ヒーローの「今すぐ診断を始める」ボタン
function scrollToTestSection(){
  const testSection = document.getElementById('test-section');
  testSection.scrollIntoView({ behavior: 'smooth' });
}

// (2) 質問データ & カード生成
const questionsData = [
  { id:1, text:'「先々のこと」を考えて、根拠のない不安や焦りに襲われることが多い。', type:'future' },
  { id:2, text:'人前で意見を言う場面を想像するだけで、体がこわばる。', type:'social' },
  { id:3, text:'「もし〇〇だとしたら？」と悪い方へ想像しすぎて、気づくと落ち込んでいる。', type:'future' },
  { id:4, text:'対人関係で、相手のちょっとした言い方に必要以上にショックを受ける。', type:'social' },
  { id:5, text:'誰かから否定的なコメントをされると、長時間引きずってしまう。', type:'evaluation' },
  { id:6, text:'物事を 100% 完璧にしないと気が済まないが、実際には疲れ果てる。', type:'perfection' },
  { id:7, text:'些細な体調変化でも「大きな病気かも…」と不安になる。', type:'health' },
  { id:8, text:'未来や人生の意味を考えると、急に怖さやむなしさを感じる。', type:'existential' },
  { id:9, text:'過去の痛い経験を思い出して、心拍数が上がったり涙が出たりして止まらないことがある。', type:'trauma' },
  { id:10, text:'仕事や勉強など、常に時間に追われている気がして気が休まらない。', type:'pressure' },
  { id:11, text:'「将来この状況がもっと悪くなるかも…」とネガティブ連想しがち。', type:'future' },
  { id:12, text:'何気ない会話でも、相手に「嫌われたかも」「不機嫌かも」と過剰に推測してしまう。', type:'social' },
  { id:13, text:'少しでも失敗や不完全さを感じると「自分はダメだ」と強く思い込む。', type:'perfection' },
  { id:14, text:'「健康診断で問題なし」と言われても「検査漏れかも…」と気になってしまう。', type:'health' },
  { id:15, text:'夜、突然「死ぬってどうなるの？」と不安が止まらなくなることがある。', type:'existential' },
  { id:16, text:'似たシチュエーションを見るだけで、痛い過去がリアルに蘇って苦しくなる。', type:'trauma' },
  { id:17, text:'周囲が忙しく動いていると、自分も何かしなきゃと強烈に焦る。', type:'pressure' },
  { id:18, text:'「人が注目している」と意識した瞬間に、うまく話せなくなることが多い。', type:'social' },
  { id:19, text:'失敗やミスを責められるのが怖くて、行動する前からドキドキが止まらない。', type:'evaluation' },
  { id:20, text:'休みの日でも「本当に休んでいていいのか…」と不安になり休めない。', type:'pressure' },
];

const typeNames = {
  future:       "未来予報ビクビク型（将来不安）",
  social:       "人間関係オロオロ型（対人不安）",
  evaluation:   "評価ドキドキ型（評価不安）",
  perfection:   "完璧主義パニック型（完璧主義）",
  health:       "健康オタオタ型（健康不安）",
  existential:  "存在意義グラグラ型（存在論的不安）",
  trauma:       "トラウマシンドローム型（トラウマ起因）",
  pressure:     "プレッシャー爆発型（高ストレス環境）"
};

// ページ読み込み時：質問カード生成
window.addEventListener('DOMContentLoaded', () => {
  const questionContainer = document.getElementById('questionContainer');
  questionsData.forEach((q) => {
    // カラム + Card
    const col = document.createElement('div');
    col.className = "col fade-in";

    // カードHTML
    col.innerHTML = `
      <div class="card shadow-sm">
        <div class="card-body">
          <h5 class="question-title mb-2">Q${q.id}. ${q.text}</h5>
          <div class="mb-2">
            ${[1,2,3,4,5].map(score => `
              <label class="score-option">
                <input type="radio" name="Q${q.id}" value="${score}"> ${score}
              </label>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    questionContainer.appendChild(col);
  });
});

// (3) 回答送信
function submitAnswers(){
  let scores = {
    future:0, social:0, evaluation:0, perfection:0,
    health:0, existential:0, trauma:0, pressure:0
  };

  for(let i=0; i<questionsData.length; i++){
    const q = questionsData[i];
    const radios = document.getElementsByName(`Q${q.id}`);
    let val = 0;
    for(const r of radios){
      if(r.checked){
        val = parseInt(r.value,10);
        break;
      }
    }
    if(val===0){
      alert(`質問${q.id}が未回答です。`);
      return;
    }
    scores[q.type] += val;
  }

  displayResult(scores);
}

/** 結果を表示してスクロール */
function displayResult(scores){
  const resultCard = document.getElementById('resultCard');
  const resultText = document.getElementById('resultText');
  const resultAdvice = document.getElementById('resultAdvice');

  // 各タイプの得点リスト
  let html = `<ul class="list-group">`;
  for(let t in scores){
    html += `
      <li class="list-group-item">
        <span class="type-score">${typeNames[t]}:</span>
         ${scores[t]} 点
      </li>
    `;
  }
  html += `</ul>`;

  resultText.innerHTML = html;

  resultAdvice.innerHTML = `
    <p class="mt-3">
      高得点のタイプが複数ある場合、複合的な不安が絡み合っているかもしれません。<br>
      深刻だと感じるときは専門家へ相談を検討してみてください。
    </p>
  `;

  // カードを表示
  resultCard.style.display = 'block';

  // スクロールして結果部分へ
  resultCard.scrollIntoView({ behavior:'smooth' });
}
