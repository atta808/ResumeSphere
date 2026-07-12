import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { PremiumHeader, Icon } from '../../components/common';
import { useTheme } from '../../theme';
import { useAIHistory } from '../../hooks/useAIHistory';
import { AIService } from '../../services/ai/AIEngine';
import { useProfile } from '../../hooks/useProfile';
import { useResumes } from '../../hooks/useResumes';
import { AI_ACTION_TYPES } from '../../config/ai';
import * as Clipboard from 'expo-clipboard';
import { useToast } from '../../components/common/ToastProvider';

const AIConversationScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const toast = useToast();

  // Params from navigation
  const { actionType, resumeId, profileId, sessionId, title } = route.params || {};

  const { profile } = useProfile();
  const { resumes } = useResumes();
  const { messages, currentSession, loadSession, createSession } = useAIHistory(profileId);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [localMessages, setLocalMessages] = useState([]);
  const flatListRef = useRef(null);

  // Load existing session or create a new one based on params
  useEffect(() => {
    const initSession = async () => {
      if (sessionId) {
        await loadSession(sessionId);
      } else if (profileId && resumeId) {
        const newSession = await createSession(resumeId, title);
        if (newSession && actionType) {
          // Auto-trigger the action if one was passed in
          triggerAction(newSession.id, actionType);
        }
      }
    };
    initSession();
  }, [sessionId]);

  // Sync DB messages with local state for smooth UI updates
  useEffect(() => {
    if (messages) {
      setLocalMessages(messages);
    }
  }, [messages]);

  const triggerAction = async (activeSessionId, actionTypeToRun, userText = null) => {
    if (!activeSessionId) return;
    setIsTyping(true);

    // Optimistic UI for user message
    if (userText) {
      setLocalMessages(prev => [...prev, { id: 'temp', role: 'user', content: userText, createdAt: new Date().toISOString() }]);
    }

    try {
      const activeResumeId = currentSession?.resumeId || resumeId;
      await AIService.processRequest({
        actionType: actionTypeToRun,
        profileId,
        resumeId: activeResumeId,
        sessionId: activeSessionId,
        userMessage: userText
      });
      // Reload session to get the DB persisted messages
      await loadSession(activeSessionId);
    } catch (error) {
      toast.show(error.message || 'AI request failed.', 'error');
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || !currentSession?.id) return;
    const userMessage = input.trim();
    setInput('');
    // Use GENERIC_CHAT if no specific action is set, or continue context of current action
    const currentAction = actionType || AI_ACTION_TYPES.GENERIC_CHAT;
    triggerAction(currentSession.id, currentAction, userMessage);
  };

  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
    toast.show('Copied to clipboard', 'success');
  };

  const renderMessage = ({ item }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble, {
        backgroundColor: isUser ? theme.primary : theme.card,
        borderWidth: isUser ? 0 : 1,
        borderColor: theme.border
      }]}>
        {!isUser && (
          <View style={styles.aiHeader}>
             <Icon name="color-wand" size={16} color={theme.primary} />
             <Text style={[styles.aiTitle, { color: theme.primary }]}>ResumeSphere AI</Text>
          </View>
        )}
        <Text style={[styles.messageText, { color: isUser ? '#fff' : theme.text }]}>
          {item.content}
        </Text>
        {!isUser && (
           <View style={styles.messageActions}>
              <TouchableOpacity onPress={() => copyToClipboard(item.content)} style={styles.actionBtn}>
                 <Icon name="copy-outline" size={16} color={theme.textSecondary} />
                 <Text style={[styles.actionText, { color: theme.textSecondary }]}>Copy</Text>
              </TouchableOpacity>
           </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader
        title={currentSession?.title || title || 'AI Assistant'}
        onBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          ref={flatListRef}
          data={localMessages}
          keyExtractor={(item, index) => item.id || String(index)}
          renderItem={renderMessage}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
        />

        {isTyping && (
          <View style={styles.typingIndicator}>
            <ActivityIndicator size="small" color={theme.primary} />
            <Text style={[styles.typingText, { color: theme.textSecondary }]}>AI is thinking...</Text>
          </View>
        )}

        <View style={[styles.inputContainer, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
          <TextInput
            style={[styles.input, { color: theme.text, backgroundColor: theme.background }]}
            placeholder="Ask AI anything about your career..."
            placeholderTextColor={theme.textSecondary}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: input.trim() ? theme.primary : theme.border }]}
            onPress={handleSend}
            disabled={!input.trim() || isTyping}
          >
            <Icon name="send" size={20} color={input.trim() ? '#fff' : theme.textSecondary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 20,
  },
  messageBubble: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    maxWidth: '85%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
  },
  messageActions: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150,150,150,0.2)',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    fontSize: 12,
    marginLeft: 4,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingLeft: 20,
  },
  typingText: {
    marginLeft: 12,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 16,
    marginRight: 12,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AIConversationScreen;
