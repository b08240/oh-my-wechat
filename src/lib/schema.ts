import type { AppMessageEntity } from "@/components/message/app-message.tsx";
import type { ChatroomVoipMessageEntity } from "@/components/message/chatroom-voip-message.tsx";
import type { ContactMessageEntity } from "@/components/message/contact-message.tsx";
import type { ImageMessageEntity } from "@/components/message/image-message.tsx";
import type { LocationMessageEntity } from "@/components/message/location-message.tsx";
import type { MicroVideoMessageEntity } from "@/components/message/micro-video-message.tsx";
import type { StickerMessageEntity } from "@/components/message/sticker-message.tsx";
import type { SystemExtendedMessageEntity } from "@/components/message/system-extended-message.tsx";
import type { SystemMessageEntity } from "@/components/message/system-message.tsx";
import type { TextMessageEntity } from "@/components/message/text-message.tsx";
import type { VideoMessageEntity } from "@/components/message/video-message.tsx";
import type { VoiceMessageEntity } from "@/components/message/voice-message.tsx";
import type { VoipMessageEntity } from "@/components/message/voip-message.tsx";
import type { Database } from "sql.js";

export interface WCDatabases {
  manifest?: Database;
  session?: Database;
  message?: Database[];
  WCDB_Contact?: Database;
}

export type WCDatabaseNames = keyof WCDatabases;

export enum MessageDirection {
  outgoing = 0,
  incoming = 1,
}

export type DatabaseRow<T extends object> = T & {
  rowid: number;
};

export type DatabaseSessionAbstractRow = DatabaseRow<{
  CreateTime: number;
  UsrName: string;
}>;

export type DatabaseFriendRow = DatabaseRow<{
  userName: string;
  certificationFlag: number; // 0: 个人
  // dbContactBrand BLOB,
  dbContactChatRoom: Uint8Array;
  // dbContactEncryptSecret BLOB,
  dbContactHeadImage: Uint8Array;
  // dbContactLocal BLOB,
  // dbContactOpenIM BLOB,
  // dbContactOther BLOB,
  dbContactProfile: Uint8Array;
  dbContactRemark: Uint8Array;
  dbContactSocial: Uint8Array;
  encodeUserName: string;
  extFlag: number;
  imgStatus: number;
  openIMAppid: string;
  type: number;
  typeExt: number;
}>;

export type DatabaseMessageRow = DatabaseRow<{
  CreateTime: number;
  Des: MessageDirection;
  ImgStatus: 1 | 2; // unknown
  MesLocalID: string;
  Message: string;
  MesSvrID: string;
  Status: number;
  TableVer: number;
  Type: MessageType;
}>;

export interface Contact {
  wxid: `wxid_${string}`;
  id: string;
  nickname: string;
  nicknamePinyin: string;
  remark: string;
  remarkPinyin: string;
  remarkPinyinInits: string;
}

export interface User {
  id: string; // wxid
  user_id: string;
  username: string;
  remark?: string;
  bio: string;
  photo?: {
    origin?: string;
    thumb: string;
  };
}

export interface Group {
  id: `${string}@chatroom`;
  title: string;
  remark?: string;
  photo?: {
    origin?: string;
    thumb: string;
  };

  members: User[];
}

interface BasicChat {
  id: string;
  title: string;
  photo?: string;
  last_message?: DatabaseMessageRow;
  is_pinned: boolean;
  is_collapsed: boolean;
  members: User[];
  background?: string;
}

export interface PrivateChat extends BasicChat {
  type: "private";
  user: User;
}

export interface GroupChat extends BasicChat {
  type: "chatroom";
  group: Group;
}

export type Chat = PrivateChat | GroupChat;

export interface PhotpSize {
  src: string;
  size: "origin" | "thumb";
  width?: number;
  height?: number;
  file_size?: number;
}

export interface ControllerResult<T> {
  data: T;
}

export interface ControllerPaginatorResult<T> extends ControllerResult<T> {
  meta: {
    cursor?: number;
    next_cursor?: number;
  };
}

/* Message Types */

export enum MessageType {
  TEXT = 1, // 文本消息
  IMAGE = 3, // 图片消息
  VOICE = 34, // 语音消息
  CONTACT = 42, // 名片消息（人/公众号）
  VIDEO = 43, // 视频消息
  STICKER = 47, // 表情
  LOCATION = 48, // 位置消息
  APP = 49, // 好多可能，里面还有类型
  VOIP = 50, // 语音/视频通话
  MICROVIDEO = 62, // 小视频
  GROUP_VOIP = 64, // 群语音/视频通话 TODO: 可能是通知
  SYSTEM = 10000, // 系统消息,应该只是文本
  SYSTEM_EXTENDED = 10002,
}

export enum AppMessageType {
  TEXT = 1,
  IMAGE = 2,
  AUDIO = 3,
  VIDEO = 4,
  URL = 5, // 小程序通知？
  ATTACH = 6,
  STICKER = 8,
  FORWARD_MESSAGE = 19,
  MINIAPP = 33,
  MINIAPP_UNKNOWN = 36,
  CHANNEL = 51,
  REFER = 57,
  PAT = 62, //拍一拍
  LIVE = 63,
  ATTACH_2 = 74,
  ANNOUNCEMENT = 87,
  GAME_SHARE = 101,
  TRANSFER = 2000,
  RED_ENVELOPE = 2001,
}

export interface BasicMessage<T extends MessageType, S> {
  id: string; // Message server id
  local_id: string;
  type: T;
  from: User;
  date: number;
  direction: MessageDirection;
  chat: Chat; // Chat the message belongs to
  message_entity: S;
  reply_to_message?: Message;
  raw_message: string;
}

export type TextMessage = BasicMessage<MessageType.TEXT, TextMessageEntity>;
export type ImageMessage = BasicMessage<MessageType.IMAGE, ImageMessageEntity>;
export type VoiceMessage = BasicMessage<MessageType.VOICE, VoiceMessageEntity>;
export type ContactMessage = BasicMessage<
  MessageType.CONTACT,
  ContactMessageEntity
>;
export type VideoMessage = BasicMessage<MessageType.VIDEO, VideoMessageEntity>;
export type StickerMessage = BasicMessage<
  MessageType.STICKER,
  StickerMessageEntity
>;
export type LocationMessage = BasicMessage<
  MessageType.LOCATION,
  LocationMessageEntity
>;
export type AppMessage<T = {
  type: 0
}> = BasicMessage<MessageType.APP, AppMessageEntity<T>>;
export type VoipMessage = BasicMessage<MessageType.VOIP, VoipMessageEntity>;
export type MicroVideoMessage = BasicMessage<
  MessageType.MICROVIDEO,
  MicroVideoMessageEntity
>;
export type ChatroomVoipMessage = BasicMessage<
  MessageType.GROUP_VOIP,
  ChatroomVoipMessageEntity
>;
export type SystemMessage = BasicMessage<
  MessageType.SYSTEM,
  SystemMessageEntity
>;
export type SystemExtendedMessage = BasicMessage<
  MessageType.SYSTEM_EXTENDED,
  SystemExtendedMessageEntity
>;

export type Message =
  | TextMessage
  | ImageMessage
  | VoiceMessage
  | ContactMessage
  | VideoMessage
  | StickerMessage
  | LocationMessage
  | AppMessage
  | VoipMessage
  | MicroVideoMessage
  | ChatroomVoipMessage
  | SystemMessage
  | SystemExtendedMessage;
