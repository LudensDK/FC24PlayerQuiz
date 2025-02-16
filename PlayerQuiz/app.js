function startProcess() {

    const overlay = document.getElementById('overlay');
    overlay.style.display = 'block'; // オーバーレイを表示

    const minRating = parseFloat(document.getElementById('min-rating').value);

    fetch('data/soccer_players.csv') // CSVファイルを読み込む
        .then(response => response.text())
        .then(csvText => {
            const rows = csvText.split('\n').map(row => row.split(','));
            const headers = rows[0]; // ヘッダー行
            const data = rows.slice(1).map(row => {
                return {
                    short_name: row[headers.indexOf("short_name")],
                    nationality_name: row[headers.indexOf("nationality_name")],
                    player_positions: row[headers.indexOf("player_positions")],
                    overall: parseFloat(row[headers.indexOf("overall")]), // 評価値
                    player_id: parseInt(row[headers.indexOf("player_id")]),
                    club_team_id: parseInt(row[headers.indexOf("club_team_id")]),
                    nationality_id: parseInt(row[headers.indexOf("nationality_id")]),
                    club_name: row[headers.indexOf("club_name")]
                };
            });

            // フィルタリングして最低評価値以上かつ100以下の選手を抽出
            const filteredPlayers = data.filter(player => player.overall >= minRating && player.overall <= 100);

            if (filteredPlayers.length === 0) {
                alert("条件に合う選手が見つかりませんでした。");
                return;
            }

            // シャッフルして指定された人数の選手を選択
            shuffle(filteredPlayers);
            const selectedPlayers = filteredPlayers.slice(0, 1);

            // 最も評価値の高い選手をトッププレイヤーとする
            const topPlayer = selectedPlayers.reduce((a, b) => a.overall > b.overall ? a : b);

            showTopPlayerInfo(topPlayer); // トッププレイヤー情報を表示
            showSelectedPlayersInfo(otherPlayers); // セレクテッドプレーヤーを表示
        });
}

// シャッフル関数
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // 要素を交換
    }
}

// 指定した桁数に満たない場合、ゼロで埋める関数
function zeroPad(num, places) {
    const numStr = String(num); // 整数を文字列に変換
    const zeroCount = Math.max(places - numStr.length, 0); // 必要なゼロの数を計算
    return '0'.repeat(zeroCount) + numStr; // ゼロ埋め
}

function showTopPlayerInfo(topPlayer) {
    const displayArea = document.getElementById('top-player-display');
    displayArea.innerHTML = ''; // クリアしてから追加

    // セクションコンテナを作成してセクション1、2、3を配置
    const sectionContainer = document.createElement('div');
    sectionContainer.id = 'section-container'; // コンテナID
    displayArea.appendChild(sectionContainer);

    // 国籍を表示
    setTimeout(() => {
        const section1 = document.createElement('div');
        section1.id = 'section1';
        section1.classList.add('fade-in');

        // チーム名
        const teamName = document.createElement('p');
        teamName.textContent = `国籍: ${topPlayer.nationality_name}`;

        // チームのエンブレム画像
        const NationTeamId = topPlayer.nationality_id; // チームID
        const emblemImg = document.createElement('img');
        const emblemImgURL = `https://game-assets.fut.gg/2024/nations/${NationTeamId}.png`;

        emblemImg.src = emblemImgURL;
        emblemImg.alt = `国旗: ${topPlayer.nationality_name}`;
        emblemImg.style.maxWidth = "150px"; // 画像のサイズ

        /* section3.appendChild(teamName); // チーム名を追加 */
        section1.appendChild(emblemImg); // エンブレム画像を追加
        sectionContainer.appendChild(section1);
    }, 0); // 即時表示

    // ポジションを表示
    setTimeout(() => {
        const section2 = document.createElement('div');
        section2.id = 'section2';
        section2.classList.add('fade-in');
        section2.textContent = `${topPlayer.player_positions.split(',')[0]}`;
        sectionContainer.appendChild(section2);
    }, 3000); // 3秒後に表示

    // チーム名を表示
    setTimeout(() => {
        const section3 = document.createElement('div');
        section3.id = 'section3';
        section3.classList.add('fade-in');

        // チーム名
        const teamName = document.createElement('p');
        teamName.textContent = `チーム: ${topPlayer.club_name}`;

        // チームのエンブレム画像
        const clubTeamId = topPlayer.club_team_id; // チームID
        const emblemImg = document.createElement('img');
        const emblemImgURL = `https://cdn.futbin.com/content/fifa24/img/clubs/${clubTeamId}.png`;

        emblemImg.src = emblemImgURL;
        emblemImg.alt = `エンブレム: ${topPlayer.club_name}`;
        emblemImg.style.maxWidth = "150px"; // エンブレム画像のサイズ

        /* section3.appendChild(teamName); // チーム名を追加 */
        section3.appendChild(emblemImg); // エンブレム画像を追加
        sectionContainer.appendChild(section3);
    }, 6000); // 3秒後に表示

    // 名前と顔写真を表示
    setTimeout(() => {
        const section4 = document.createElement('div');
        section4.id = 'section4';
        section4.classList.add('fade-in');

        const img = document.createElement('img');
        const playerID = topPlayer.player_id;
        const idPart1 = zeroPad(Math.floor(playerID / 1000), 3); // 3桁にゼロ埋め
        const idPart2 = zeroPad(playerID % 1000, 3); // 3桁にゼロ埋め
        const imgURL = `https://cdn.futbin.com/content/fifa24/img/players/${playerID}.png`;
        img.src = imgURL;
        img.alt = topPlayer.short_name;

        section4.appendChild(img); // 顔写真
        section4.appendChild(document.createElement('p')).textContent = `${topPlayer.short_name} - ${topPlayer.overall}`;


        displayArea.appendChild(section4);
    }, 10000); // 10秒後に表示
}



function resetProcess() {
    const displayArea = document.getElementById('top-player-display');
    displayArea.innerHTML = ''; // トッププレーヤー情報をクリア
    overlay.style.display = 'none'; // オーバーレイを表示

}