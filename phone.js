// The phone on the first screen works as the app does: the arrows move the
// light over Home, ひ opens what is lit, holding ◀ goes back. Every screen
// is a shot of the app (shots/<lang>/home-<n>.webp, shots/<lang>/<app>.webp).
(function () {
  var phone = document.getElementById('phone');
  if (!phone) return;
  var glass = document.getElementById('glass');
  var nameEl = document.getElementById('lit-name');
  var lineEl = document.getElementById('lit-line');

  // Home's nine, in its reading order.
  var apps = ['contacts', 'album', 'settings', 'bank', 'games', 'board', 'camera', 'pager', 'walkie'];
  var words = {
    en: {
      names: {
        contacts: 'Contacts', album: 'Album', settings: 'Settings',
        bank: 'Bank', games: 'Games', board: 'Board',
        camera: 'Camera', pager: 'Pager', walkie: 'Walkie-talkie'
      },
      lines: {
        contacts: 'Only people you’ve met: add someone with your code. Everyone is a five-digit number and a stitched face. Side by side, connect with the tin can — then write, or challenge each other.',
        album: 'What you keep: photos, videos, recordings, cloths — and every personal best, taped.',
        settings: 'Language, volume, music, vibration, the lock, a backup — and Sponsor.',
        bank: 'Every coin written in a book, savings that grow by the day — and the Shop.',
        games: 'Six games, each with How to play. Nothing moves until you do.',
        board: 'Hitokoe’s own posts and ads, the same for everyone.',
        camera: 'Photos and video, with a cat if you like. Bought with coins.',
        pager: 'Letters made of little pictures, sealed so only the two of you can read them.',
        walkie: 'Hold to record, let go to pause, then keep the tape or let it go.'
      },
      home: 'Hitokoe’s Home, %s lit',
      open: 'Hitokoe’s %s'
    },
    vi: {
      names: {
        contacts: 'Danh bạ', album: 'Album', settings: 'Cài đặt',
        bank: 'Ngân hàng', games: 'Trò chơi', board: 'Board',
        camera: 'Máy ảnh', pager: 'Máy nhắn tin', walkie: 'Bộ đàm'
      },
      lines: {
        contacts: 'Chỉ những người bạn đã gặp: thêm người bằng mã của bạn. Mỗi người là một số năm chữ số và một gương mặt thêu. Đứng cạnh nhau thì nối máy bằng ống bơ — rồi viết thư, hoặc thách đấu nhau.',
        album: 'Những gì bạn giữ: ảnh, video, ghi âm, tấm vải — và mọi lần phá PB, quay lại sẵn.',
        settings: 'Ngôn ngữ, âm lượng, nhạc, rung, khoá, sao lưu — và Ủng hộ.',
        bank: 'Từng đồng xu ghi vào sổ, tiền tiết kiệm lớn dần theo ngày — và Cửa hàng.',
        games: 'Sáu trò chơi, trò nào cũng có Hướng dẫn. Bạn chưa đi thì không gì nhúc nhích.',
        board: 'Bài và quảng cáo của chính Hitokoe, ai cũng thấy như nhau.',
        camera: 'Ảnh và video, thêm mèo nếu thích. Mua bằng xu.',
        pager: 'Thư ghép từ hình nhỏ, niêm phong nên chỉ hai người đọc được.',
        walkie: 'Giữ để ghi, thả để tạm dừng, rồi giữ cuộn băng hoặc bỏ đi.'
      },
      home: 'Màn hình chính của Hitokoe, đang sáng ở %s',
      open: '%s của Hitokoe'
    }
  };

  var lit = 4; // Games, the middle of the first page, as the phone opens
  var open = null;

  function lang() {
    return document.documentElement.getAttribute('data-lang') === 'vi' ? 'vi' : 'en';
  }
  function shot(name) {
    return 'shots/' + lang() + '/' + name + '.webp';
  }

  function render() {
    var w = words[lang()];
    var app = open || apps[lit];
    glass.src = shot(open || 'home-' + lit);
    glass.alt = (open ? w.open : w.home).replace('%s', w.names[app]);
    nameEl.textContent = w.names[app];
    lineEl.textContent = w.lines[app];
  }

  function move(k) {
    if (open) return; // a key that goes nowhere says nothing
    var col = lit % 3;
    var to = lit;
    if (k === 'up' && lit >= 3) to = lit - 3;
    if (k === 'down' && lit < 6) to = lit + 3;
    if (k === 'left' && col > 0) to = lit - 1;
    if (k === 'right' && col < 2) to = lit + 1;
    if (to !== lit) {
      lit = to;
      render();
    }
  }
  function ok() {
    if (open) return;
    open = apps[lit];
    render();
  }
  function back() {
    if (!open) return;
    open = null;
    render();
  }

  // ◀ held goes back; ◀ let go before that moves left.
  var holdTimer = null;
  var held = false;
  function leftDown() {
    held = false;
    clearTimeout(holdTimer);
    holdTimer = setTimeout(function () { held = true; back(); }, 450);
  }
  function leftUp() {
    clearTimeout(holdTimer);
    if (!held) move('left');
  }

  function pressed(b) {
    b.classList.add('down');
    setTimeout(function () { b.classList.remove('down'); }, 140);
  }

  phone.querySelectorAll('.key').forEach(function (b) {
    var k = b.getAttribute('data-key');
    if (k === 'left') {
      var down = false;
      b.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        down = true;
        b.classList.add('down');
        leftDown();
      });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (type) {
        b.addEventListener(type, function () {
          if (!down) return;
          down = false;
          b.classList.remove('down');
          if (type === 'pointerup') leftUp();
          else clearTimeout(holdTimer);
        });
      });
      b.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    } else {
      b.addEventListener('click', function () {
        pressed(b);
        if (k === 'ok') ok();
        else move(k);
      });
    }
  });

  var arrows = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
  phone.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!e.repeat) ok();
      return;
    }
    if (e.key === 'Escape' || e.key === 'Backspace') {
      e.preventDefault();
      back();
      return;
    }
    var k = arrows[e.key];
    if (!k) return;
    e.preventDefault();
    if (k === 'left') {
      if (!e.repeat) leftDown();
      return;
    }
    move(k);
  });
  phone.addEventListener('keyup', function (e) {
    if (e.key === 'ArrowLeft') leftUp();
  });

  // The other screens are fetched once someone reaches for the phone.
  var warmed = {};
  function warm() {
    var l = lang();
    if (warmed[l]) return;
    warmed[l] = true;
    apps.forEach(function (a, i) {
      new Image().src = shot('home-' + i);
      new Image().src = shot(a);
    });
  }
  ['pointerenter', 'focus', 'touchstart'].forEach(function (type) {
    phone.addEventListener(type, warm, { passive: true });
  });

  document.addEventListener('langchange', function () {
    render();
    if (Object.keys(warmed).length) warm();
  });
  render();
})();
