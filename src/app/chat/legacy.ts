// const chatCompletion = async (input: string) => {
//   setLoading(true);
//   const formattedMessages = formatMessages(messages, input);
//   try {
//     let data;
//     let response;
//     let responseOk;
//     if (
//       process.env.NEXT_PUBLIC_MOCK_OPENAI_API == 'true' &&
//       process.env.NEXT_PUBLIC_MOCK_OPENAI_RESPONSE
//     ) {
//       response = undefined;
//       data = JSON.parse(process.env.NEXT_PUBLIC_MOCK_OPENAI_RESPONSE);
//       responseOk = true;
//     } else {
//       response = await fetch('/api/chat/tts-chat', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formattedMessages),
//       });
//       data = await response.json();
//       responseOk = response.ok;
//     }

//     if (responseOk) {
//       const assistantResponse: Message = {
//         role: 'assistant',
//         content: data.message,
//         audioId: data.audioId,
//       };
//       setMessages((prevMessages) => [...prevMessages, assistantResponse]);
//     } else {
//       console.error('Error fetching chat completion:', data.error);
//     }
//   } catch (error) {
//     console.error('Error fetching chat completion:', error);
//   }
//   setLoading(false);
// };

// const formatMessages = (messages: Message[], input: string) => {
//   if (modality === 'ttt') {
//     const chatHistory = messages.map((message) => {
//       return { role: message.role, content: message.content };
//     });

//     const userInput = {
//       role: 'user',
//       content: input,
//     };

//     return [SYSTEM_PROMPT, ...chatHistory, userInput];
//   } else {
//     throw new Error(`Modality '${modality}' not supported`);
//   }
//   // } else {
//   //   if (message.role === 'user') {
//   //     return { role: 'user', content: message.content };
//   //   } else {
//   //     return { role: 'assistant', audio: { id: message.audioId } };
//   //   }
//   // }
// };
