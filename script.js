/************************************************************
 * script.js
 * - 質問を生成
 * - 「今すぐ診断」クリックで表示
 * - ボタン押下で色が付く (checked)
 * - submitAnswersでスコア集計、結果1つだけ判定
 ************************************************************/

// 質問データ
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

// 8タイプ & 簡易説明
const typeDefinitions = {
  future: {
    name: "未来予報ビクビク型（将来不安）",
    detail: `主に質問: 1, 3, 11 → 高得点なら将来への漠然とした不安が強い`
  },
  social: {
    name: "人間関係オロオロ型（対人不安）",
    detail: `質問: 2, 4, 12, 18 → 人前での緊張や他人の反応を過剰に気にしがち`
  },
  evaluation: {
    name: "評価ドキドキ型（評価不安）",
    detail: `質問: 5, 19 → 他者の評価やネガティブな反応に強い恐怖を感じる`
  },
  perfection: {
    name: "完璧主義パニック型（完璧主義）",
    detail: `質問: 6, 13 → ミスや不完全さを強く恐れ、自分を追い込む`
  },
  health: {
    name: "健康オタオタ型（健康不安）",
    detail: `質問: 7, 14 → 体調や検査結果に過度な疑いと不安`
  },
  existential: {
    name: "存在意義グラグラ型（存在論的不安）",
    detail: `質問: 8, 15 → 生きる意味、死の恐怖への不安が強い`
  },
  trauma: {
    name: "トラウマシンドローム型（トラウマ起因）",
    detail: `質問: 9, 16 → 過去の傷がフラッシュバックし、感情や行動に影響`
  },
  pressure: {
    name: "プレッシャー爆発型（高ストレス環境）",
    detail: `質問: 10, 17, 20 → 仕事量や周囲からの期待で心身が限界に近い`
  },
};

/** 最初にヒーローだけ表示 → 今すぐ診断でここが呼ばれる */
function showQuestionSection(){
  const section = document.getElementById('question-section');
  section.style.display = 'block';
  generateQuestions(); // 質問カード生成
  section.scrollIntoView({ behavior:'smooth' });
}

/** 質問カード生成: 1問1枠、ボタン(1~5) */
function generateQuestions(){
  const container = document.getElementById('questionContainer');
  if(container.children.length > 0) return; // 2度目の呼び出し防止

  questionsData.forEach(q => {
    // カード
    const cardDiv = document.createElement('div');
    cardDiv.className = "question-card fade-in";

    // 1~5の選択肢: 全て同じ幅のカードに
    // クリック時だけ色を付けたい→ :checked + label で対応
    let choicesHtml = '';
    for(let score=1; score<=5; score++){
      choicesHtml += createRadioButtonHTML(q.id, score);
    }

    cardDiv.innerHTML = `
      <div class="question-title mb-3">Q${q.id}. ${q.text}</div>
      <div class="btn-choice-group">
        ${choicesHtml}
      </div>
    `;

    container.appendChild(cardDiv);
  });
}

/** ラジオボタン＋labelを生成する関数 */
function createRadioButtonHTML(qId, score){
  // ボタンに付与するクラス（押したら色が付くのは :checked + label）
  const colorClass = `btn-choice-${score}`;
  // 例: "Q1-1" などのid
  const inputId = `Q${qId}-${score}`;

  return `
    <input type="radio" class="btn-check" name="Q${qId}" id="${inputId}" value="${score}">
    <label for="${inputId}" class="btn btn-choice ${colorClass}">${score}</label>
  `;
}

/** 回答送信 -> 集計 */
function submitAnswers(){
  // 集計オブジェクト
  let scores = {
    future:0, social:0, evaluation:0, perfection:0,
    health:0, existential:0, trauma:0, pressure:0
  };

  // 全質問に対して回答を取得
  for(const q of questionsData){
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

  // 最高スコアのタイプ1つを判定
  let maxType = null;
  let maxScore = -1;
  for(let t in scores){
    if(scores[t] > maxScore){
      maxScore = scores[t];
      maxType = t;
    }
  }

  showResult(maxType, maxScore);
}

/** 結果表示: 1つだけ「あなたはXXタイプです！」 */
function showResult(type, score){
  const resultCard = document.getElementById('resultCard');
  const resultText = document.getElementById('resultText');
  const resultAdvice = document.getElementById('resultAdvice');

  // 選ばれたタイプの情報
  const td = typeDefinitions[type];

  // "あなたは 〇〇です！" とその説明
  resultText.innerHTML = `
    <h4 class="mb-3" style="font-weight:bold;">
      あなたは「${td.name}」です！
    </h4>
    <p class="mb-2 text-muted">（スコア: ${score}）</p>
    <p>${td.detail}</p>
  `;

  resultAdvice.innerHTML = `
    <p class="mt-3">
      不安が強いと感じる場合は専門家（医療機関、カウンセリング）への相談を検討しましょう。
    </p>
  `;

  resultCard.style.display = 'block';
  resultCard.scrollIntoView({ behavior:'smooth' });
}
