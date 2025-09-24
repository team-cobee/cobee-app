import React, { useMemo } from 'react';
import { Modal, View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

export type AddressResult = {
  postalCode: string;     // 우편번호 (zonecode)
  roadAddress: string;    // 도로명주소
  jibunAddress: string;   // 지번주소
  sido: string;           // 시/도
  sigungu: string;        // 시/군/구
  bname: string;          // 법정동
  buildingName: string;   // 건물명
  fullAddress: string;    // 최종 표기용(도로명 주소 + 건물명)
};

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (addr: AddressResult) => void;
  startingQuery?: string; // "서울시 청파로"처럼 미리 검색어 넣고 시작하고 싶을 때
}

// const handleMessage = (e: WebViewMessageEvent) => {
//   try {
//     const msg = JSON.parse(e.nativeEvent.data);
//     if (msg.type === 'SELECT') {
//       // 먼저 부모에게 데이터 전달
//       onSelect(msg.payload as AddressResult);
//       // 그 다음 모달 닫기 (setTimeout으로 순서 보장)
//       setTimeout(() => {
//         onClose();
//       }, 100);
//     }
//   } catch (error) {
//     console.log('Address selection error:', error);
//   }
// };

export default function AddressSearchModal({ visible, onClose, onSelect, startingQuery }: Props) {
  const html = useMemo(() => `
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<style>
  html, body { height: 100%; margin: 0; padding: 0; }
  #wrap { height: 100vh; }
</style>
</head>
<body>
  <div id="wrap"></div>
  <script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
  <script>
    (function(){
      function sendToRN(payload){
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(payload));
      }

      var opt = {
        oncomplete: function(data) {
          // data 예시: https://postcode.map.daum.net/guide 참조
          var road = data.roadAddress || '';
          var jibun = data.jibunAddress || '';
          var extra = '';
          if (data.buildingName) extra = (extra ? ', ' : '') + data.buildingName;

          var full = road || jibun;
          if (road && data.buildingName) full = road + ' (' + data.buildingName + ')';

          var result = {
            postalCode: data.zonecode || '',
            roadAddress: road,
            jibunAddress: jibun,
            sido: data.sido || '',
            sigungu: data.sigungu || '',
            bname: data.bname || '',
            buildingName: data.buildingName || '',
            fullAddress: full
          };
          sendToRN({ type: 'SELECT', payload: result });
        },
        width : '100%',
        height : '100%'
      };

      var element = document.getElementById('wrap');
      var postcode = new daum.Postcode(opt);

      // 시작 검색어가 있으면 바로 그 키워드로 오픈
      var initialQuery = ${JSON.stringify(startingQuery || '')};
      if (initialQuery) {
        postcode.embed(element, { q: initialQuery, autoClose: true });
      } else {
        postcode.embed(element, { autoClose: true });
      }

      // RN에서 닫으라는 메시지 받을 수도 있게 (필요 시)
      window.addEventListener('message', function(e){
        var msg = {};
        try { msg = JSON.parse(e.data); } catch(e){}
        if (msg.type === 'CLOSE') {
          sendToRN({ type: 'CLOSE' });
        }
      });
    })();
  </script>
</body>
</html>
  `.trim(), [startingQuery]);

  const handleMessage = (e: WebViewMessageEvent) => {
  try {
    const msg = JSON.parse(e.nativeEvent.data);
    if (msg.type === 'SELECT') {
      // 먼저 부모에게 데이터 전달
      onSelect(msg.payload as AddressResult);
      // 그 다음 모달 닫기 (setTimeout으로 순서 보장)
      setTimeout(() => {
        onClose();
      }, 100);
    }
  } catch (error) {
    console.log('Address selection error:', error);
  }
};


  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>주소 검색</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={{ fontWeight: '600' }}>닫기</Text>
          </TouchableOpacity>
        </View>
        <WebView
          originWhitelist={['*']}
          source={{ html }}
          onMessage={handleMessage}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
    justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 16, fontWeight: '700' , marginLeft : "40%"},
  closeBtn: { padding: 8 },
});

//AddressSearchModal.tsx
// import React, { useMemo } from 'react';
// import { Modal, View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
// import { WebView, WebViewMessageEvent } from 'react-native-webview';

// export type AddressResult = {
//   postalCode: string;
//   roadAddress: string;
//   jibunAddress: string;
//   sido: string;
//   sigungu: string;
//   bname: string;
//   buildingName: string;
//   fullAddress: string;
// };

// interface Props {
//   visible: boolean;
//   onClose: () => void;
//   onSelect: (addr: AddressResult) => void;
//   startingQuery?: string;
// }

// export default function AddressSearchModal({ visible, onClose, onSelect, startingQuery }: Props) {
//   const html = useMemo(() => `
// <!DOCTYPE html>
// <html lang="ko">
// <head>
// <meta charset="utf-8" />
// <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
// <style>
//   html, body { height: 100%; margin: 0; padding: 0; }
//   #wrap { height: 100vh; }
//   #debug { position: fixed; bottom: 8px; left: 8px; background: rgba(0,0,0,.6); color:#fff; padding:4px 6px; font-size:12px; border-radius:4px; }
// </style>
// </head>
// <body>
//   <div id="wrap"></div>
//   <div id="debug">booting...</div>
//   <script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
//   <script>
//     (function(){
//       function sendToRN(payload){
//         try {
//           document.getElementById('debug').innerText = 'send: ' + (payload.type || '');
//         } catch(e){}
//         window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(payload));
//       }

//       sendToRN({ type: 'READY' });

//       var element = document.getElementById('wrap');
//       var postcode = new daum.Postcode({
//         oncomplete: function(data) {
//           var road = data.roadAddress || '';
//           var jibun = data.jibunAddress || '';
//           var full = road || jibun;
//           if (road && data.buildingName) full = road + ' (' + data.buildingName + ')';

//           var result = {
//             postalCode: data.zonecode || '',
//             roadAddress: road,
//             jibunAddress: jibun,
//             sido: data.sido || '',
//             sigungu: data.sigungu || '',
//             bname: data.bname || '',
//             buildingName: data.buildingName || '',
//             fullAddress: full
//           };
//           // ✅ 주소 행을 탭했을 때만 여기로 들어옵니다.
//           sendToRN({ type: 'SELECT', payload: result });
//         },
//         width : '100%',
//         height : '100%'
//       });

//       var initialQuery = ${JSON.stringify(startingQuery || '')};
//       if (initialQuery) {
//         postcode.embed(element, { q: initialQuery, autoClose: true });
//       } else {
//         postcode.embed(element, { autoClose: true });
//       }

//       // (선택) RN에서 닫기 지시 받을 수 있게
//       window.addEventListener('message', function(e){
//         var msg = {};
//         try { msg = JSON.parse(e.data); } catch(e){}
//         if (msg.type === 'CLOSE') {
//           sendToRN({ type: 'CLOSE' });
//         }
//       });
//     })();
//   </script>
// </body>
// </html>
//   `.trim(), [startingQuery]);

//   const handleMessage = (e: WebViewMessageEvent) => {
//     // 🔎 원시 메시지 확인
//     console.log('[AddrModal] onMessage raw =', e?.nativeEvent?.data);

//     try {
//       const msg = JSON.parse(e.nativeEvent.data);
//       if (msg.type === 'SELECT') {
//         onSelect(msg.payload as AddressResult);
//         setTimeout(onClose, 50); // 먼저 부모에 전달 후 닫기
//       }
//     } catch (error) {
//       console.log('Address selection error:', error);
//     }
//   };

//   return (
//     <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
//       <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
//         <View style={styles.header}>
//           <Text style={styles.headerTitle}>주소 검색</Text>
//           <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
//             <Text style={{ fontWeight: '600' }}>닫기</Text>
//           </TouchableOpacity>
//         </View>
//         <WebView
//           originWhitelist={['*']}
//           source={{ html }}
//           onMessage={handleMessage}
//           javaScriptEnabled
//           domStorageEnabled
//           startInLoadingState
//           // iOS에서 혹시 모를 외부 리소스 섞임 이슈가 있으면 아래도 고려
//           // mixedContentMode="always"
//         />
//       </SafeAreaView>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     height: 48,
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     borderBottomColor: '#e5e7eb',
//     justifyContent: 'space-between',
//   },
//   headerTitle: { fontSize: 16, fontWeight: '700', marginLeft: '40%' },
//   closeBtn: { padding: 8 },
// });

// // AddressSearchModal.tsx
// import React, { useMemo } from 'react';
// import { Modal, View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
// import { WebView, WebViewMessageEvent } from 'react-native-webview';

// export type AddressResult = {
//   postalCode: string;
//   roadAddress: string;
//   jibunAddress: string;
//   sido: string;
//   sigungu: string;
//   bname: string;
//   buildingName: string;
//   fullAddress: string;
// };

// interface Props {
//   visible: boolean;
//   onClose: () => void;
//   onSelect: (addr: AddressResult) => void;
//   startingQuery?: string;
// }

// export default function AddressSearchModal({ visible, onClose, onSelect, startingQuery }: Props) {
//   const html = useMemo(() => `
// <!DOCTYPE html><html lang="ko"><head>
// <meta charset="utf-8"/>
// <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
// <style>
//   html,body{height:100%;margin:0;padding:0}
//   #btn{position:fixed;inset:0;display:flex;align-items:center;justify-content:center}
//   #btn > button{padding:14px 18px;font-size:16px;border-radius:10px;border:0;background:#111;color:#fff}
// </style>
// </head><body>
//   <div id="btn"><button type="button" id="open">주소 검색 열기</button></div>
//   <div id="wrap" style="height:100vh;display:none"></div>
//   <script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
//   <script>
//     (function(){
//       function send(type, payload){
//         window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({type, payload}));
//       }
//       send('READY');

//       var initialQuery = ${JSON.stringify(startingQuery || '')};
//       var wrap = document.getElementById('wrap');
//       var btnWrap = document.getElementById('btn');

//       function openPostcode(){
//         btnWrap.style.display='none';
//         wrap.style.display='block';
//         new daum.Postcode({
//           oncomplete: function(data){
//             var road = data.roadAddress || '';
//             var jibun = data.jibunAddress || '';
//             var full = road || jibun;
//             if (road && data.buildingName) full = road + ' (' + data.buildingName + ')';
//             send('SELECT', {
//               postalCode: data.zonecode || '',
//               roadAddress: road,
//               jibunAddress: jibun,
//               sido: data.sido || '',
//               sigungu: data.sigungu || '',
//               bname: data.bname || '',
//               buildingName: data.buildingName || '',
//               fullAddress: full
//             });
//           },
//           width:'100%', height:'100%'
//         }).embed(wrap, { q: initialQuery, autoClose: true });
//       }

//       document.getElementById('open').addEventListener('click', openPostcode);

    
//       window.addEventListener('message', function(e){
//         try{
//           var msg = JSON.parse(e.data || '{}');
//           if (msg.type === 'OPEN_AGAIN') openPostcode();
//         }catch(_){}
//       });
//     })();
//   </script>
// </body></html>
//   `.trim(), [startingQuery]);

//   const handleMessage = (e: WebViewMessageEvent) => {
//     try {
//       const msg = JSON.parse(e.nativeEvent.data);
//       if (msg.type === 'SELECT') {
//         onSelect(msg.payload as AddressResult);
//         setTimeout(onClose, 50);
//       }
//     } catch(_) {}
//   };

//   return (
//     <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
//       <SafeAreaView style={{ flex:1, backgroundColor:'#fff' }}>
//         <View style={styles.header}>
//           <Text style={styles.headerTitle}>주소 검색</Text>
//           <TouchableOpacity onPress={onClose} style={styles.closeBtn}><Text style={{fontWeight:'600'}}>닫기</Text></TouchableOpacity>
//         </View>
//         <WebView
//           originWhitelist={['*']}
//           source={{ html }}
//           onMessage={handleMessage}
//           javaScriptEnabled
//           domStorageEnabled
//           startInLoadingState
//         />
//       </SafeAreaView>
//     </Modal>
//   );
// }


// const styles = StyleSheet.create({
//   header: {
//     height: 48,
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     borderBottomColor: '#e5e7eb',
//     justifyContent: 'space-between',
//   },
//   headerTitle: { fontSize: 16, fontWeight: '700', marginLeft: '40%' },
//   closeBtn: { padding: 8 },
// });
