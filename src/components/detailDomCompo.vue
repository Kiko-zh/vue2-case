<template>
  <div class="detail">
    <div
      class="send"
    >
      <div class="send-body">
        <div
          id="jsEditorElement"
          ref="jsEditorElement"
          class="textareamock"
          tabindex="-3"
          contenteditable="true"
          :aria-placeholder="ariaPlaceholder"
          @keyup="onInputText"
          @paste="onPaste"
        />
      </div>

      <div class="send-footer">
        <span class="operate" >
          <a-popover
            v-model="visibleEmoj"
            trigger="click"
            @click="listenSendFooter"
          >
            <div
              class="emoji-panel"
              slot="content"
            >
              <div
                v-for="(src, index) in emojiSrcList"
                :key="index"
                :title="emojiList[index]"
                @click="appendEmoji(src)"
              >
                <img :src="`${src}`" />
              </div>
            </div>
            <img
              class="emoji-img"
              src="@/assets/emoji/grinning-face-with-smiling-eyes_1f604.png"
              @click="showEmoj"
            />
          </a-popover>
          <span class="alt-icon">@</span>
        </span>
        <a-button
          type="primary"
          @click="publishHandle"
        >發送</a-button>

      </div>
    </div>

    <UserSelectModal
      @ok="saveMembers"
      ref="UserSelectModalDom"
      :members="allowSelectMembers"
    ></UserSelectModal>
  </div>
</template>

<script>
/**
 * funct @sendMessage
 */
import { emojiSrcList, emojiList, groupMembers } from "@/common/constant";
import UserSelectModal from "@/components/modal/UserSelectModal";

export default {
  name: "detailDomCompo",
  components: {
    UserSelectModal
  },
  computed: {
    userInfo() {
      return this.$store.state.user.user || null;
    }
  },

  data() {
    return {
      src: "",
      showImgList: [],
      fileList: [],
      emojiSrcList,
      emojiList,
      allowSelectMembers: [], // 存储评论可以选择的人
      partBanIds: [],
      visibleEmoj: false,
      visibleAlt: false,
      selectedAlt: false,
      currentAltPosition: 0,

      editor: null,
      activeTipItem: { key: 1, text: "不提醒" }, // 提醒時間选择
      mockInput: false,
      editorRange: null,
      ariaPlaceholder: '@參與人將通過聊天發給對方'
    };
  },

  mounted() {
    this.initData()
  },

  methods: {
    listenSendFooter() {
      const editor = this.$refs.jsEditorElement;
      if (editor) {
        editor.focus();
        this.doToggleDialog();
        console.log(this.editorRange.range)
      }
    },

    /**
     * 获取地址文件名
     */
    getLastFileName(path) {
      let filename;
      if (path.indexOf("/") > 0) //如果包含有"/"号 从最后一个"/"号+1的位置开始截取字符串
      {
        filename = path.substring(path.lastIndexOf("/") + 1, path.length);
      } else {
        filename = path;
      }
      if(filename.indexOf('.')) {
        let fileArr = filename.split('.')
        return fileArr[0];
      } else {
        return filename
      }

    },

    // 发表评论
    async publishHandle() {
      // 解析文本内容
      let ressome = "";
      const atidsss = [];
      const atnames = [];
      const atmid = [];
      ressome = this.$refs.jsEditorElement.innerHTML;
      console.log('ressome==', ressome)
      console.log(this.$refs.jsEditorElement.innerHTML);

      const editor = this.$refs.jsEditorElement;
      let collect = editor.getElementsByClassName("userSetClass");
      console.log(collect, Array.from(collect).length);
      for (const child of collect) {
        atidsss.push(child.dataset.id);
        atnames.push(child.dataset.name);
        atmid.push(child.dataset.mid);
      }

      // @所有人
      let AltAll = editor.getElementsByClassName("userSetAllClass")
      // if(AltAll.)
      if(AltAll && Array.from(AltAll).length > 0) {
        let userHiddenSetClass = editor.getElementsByClassName("userHiddenSetClass")
        for (const child of userHiddenSetClass) {
          atidsss.push(child.dataset.id);
          atnames.push(child.dataset.name);
          atmid.push(child.dataset.mid);
        }
      }

      console.log(atidsss, atnames);
      let params = {
        task_id: this.activeTaskItemDetailID,
        text: this.$refs.jsEditorElement.innerHTML,
        imText: this.$refs.jsEditorElement.innerHTML,
        images: this.imgList,
        users: atidsss ? atidsss.filter((v) => v) : [],
        attachment: this.fileList,
      };
      console.log(params);
      let that = this;
      params.imText = params.imText.replace(
        /<img [^>]*src=['"]([^'"]+)[^>]*>/gi,
        function (match, capture) {
          console.log(capture);
          let name = that.getLastFileName(capture)
          if(name) {
            return `[${name}]`
          }
          return ''
        }
      );
      // 匹配a标签一定要設置href
      params.imText = params.imText.replace(
        /<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi,
        function (match, capture, text) {
          console.log(match);
          console.log(capture);
          console.log(text);
          if(text) {
            if(text.indexOf('&') > -1) {
              return ''
            }
            return text.trim()+''
          }
          return ''
        }
      );

      setTimeout(async () => {
        if (this.$refs.jsEditorElement) {
          this.$refs.jsEditorElement.textContent = "";
          this.onChangeJsEditor('')
          // 在这里做IM数据发送
          await this.sendIMMessage(atmid ? atmid.filter((v) => v) : [], params.imText, atmid);
        }
      }, 1000);
    },
    //* 发送 IM Message
    sendIMMessage(friends, text, atUserIds) {
      // 获取当前用户id
      const userID = this.userInfo ? this.userInfo.im_user_id : 0;
      if (userID && friends.length) {
        // 获取本地会话id
        console.log(userID, friends);
        let set = new Set()
        friends.forEach((element) => {
          set.add(element)
        })


        Array.from(set).forEach((element) => {
          this.handleIm(element, userID, text, atUserIds);
        });
      }
    },
    /**
     * item 接收消息人的id
     * val 当前用户mid
     * 发送的内容
     */
    handleIm(item, val, ressome, atUserIds) {
      console.log('im==', item, val, ressome, atUserIds)
    },

    //* select emoji
    selectEmoji(url) {
      const editor = this.$refs.jsEditorElement;
      if (editor) {
        editor.focus();
        // this.editorRange.selection.collapseToEnd();
        // 删掉草稿start
        const editorRange = this.editorRange.range;
        console.log(
          "editorRange",
          editorRange,
          editorRange.startOffset,
          editorRange.endOffset
        );
        if (!editorRange) {
          return;
        }
        const textNode = editorRange.endContainer; // 拿到末尾文本节点
        const endOffset = editorRange.endOffset; // 光标位置
        // 找出光标前的at符号位置
        // const textNodeValue = textNode.nodeValue
        // const expRes = (/@([^@]*)$/).exec(textNodeValue)
        // if (expRes && expRes.length > 1) {
        // editorRange.setStart(textNode, expRes.index)
        editorRange.setEnd(textNode, endOffset);
        editorRange.deleteContents(); // 删除草稿end
        const dom = this.createInsterImgData(url);
        console.log(dom);
        console.log(this.editorRange.selection);
        console.log(this.editorRange.range);
        this.insertHtmlImgAtCaret(
          dom,
          this.editorRange.selection,
          this.editorRange.range
        );
        // }
      }
    },

    //* 将emoji 插入到光标处
    insertHtmlImgAtCaret(html, selection, range) {
      if (range && selection) {
        // range.deleteContents()
        const el = document.createElement("div");
        if (typeof html === "string") {
          el.innerHTML = html;
        } else if (Array.isArray(html)) {
          html.forEach((item) => {
            el.appendChild(item);
          });
        } else {
          el.appendChild(html);
        }
        const frag = document.createDocumentFragment();
        let node;
        let lastNode;
        while ((node = el.firstChild)) {
          lastNode = frag.appendChild(node);
        }
        // frag.appendChild(el)
        console.log(frag);
        range.insertNode(frag);


        if (lastNode) {
          // selection.extend(lastNode, 1)
          selection.collapseToEnd();
        }
      }
    },
    createInsterImgData(url) {
      const btn = document.createElement("img");
      btn.setAttribute("src", url);
      btn.setAttribute("class", "emoji-img");

      btn.setAttribute("style", "width: 26px;height:26px;");
      return btn;
    },

    doToggleDialog() {
      const rangeInfo = this.getEditorRange();
      console.log('rangeInfo==', rangeInfo)
      if (!rangeInfo || !rangeInfo.range || !rangeInfo.selection) {
        return;
      }
      this.editorRange = rangeInfo;
    },
    getEditorRange() {
      let range = null;
      let selection = null;
      if (window.getSelection) {
        selection = window.getSelection();
        if (selection.getRangeAt && selection.rangeCount) {
          range = selection.getRangeAt(0);
          return {
            range,
            selection,
          };
        } else {
          return null;
        }
      } else {
        return null;
      }
    },
    saveMembers(members) {
      console.log('members--', members)
      if (this.mockInput) {
        this.instersome(members);
      } else {
        this.selectPerson(members);
      }
      if(members.length > 0) {
        console.log('onChangeJsEditor')
        this.onChangeJsEditor('members')
      }
    },
    instersome(person) {
      for (const some of person) {
        this.selectNodeContents();
        this.insertCaret(
          `<a data-id="${some.member_id}" data-mid="${some.im_user_id}" class="userSetClass" data-name="${some.member_name}" contenteditable="false">@${some.member_name}</a>&nbsp;`
        );
      }
      this.selectNodeContents();
    },
    selectNodeContents() {
      const range = document.createRange();
      range.selectNodeContents(document.getElementById("jsEditorElement"));
      range.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    },
    insertCaret(html) {
      let sel, range;
      if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
          range = sel.getRangeAt(0);
          range.deleteContents();
          const el = document.createElement("div");
          el.innerHTML = html;
          const frag = document.createDocumentFragment();
          let node = null;
          let lastNode = null;
          while ((node = el.firstChild)) {
            // eslint-disable-next-line no-unused-vars
            lastNode = frag.appendChild(node);
          }
          range.insertNode(frag);
        }
      } else if (document.selection && document.selection.type !== "Control") {
        document.selection.createRange().pasteHTML(html);
      }
    },
    //* 选择的人员
    selectPerson(person) {
      const editor = this.$refs.jsEditorElement;
      console.log('editor==', editor)
      if (editor) {
        editor.focus();
        // 删掉草稿start
        const editorRange = this.editorRange.range;
        console.log(
          "editorRange",
          editorRange,
          editorRange.startOffset,
          editorRange.endOffset
        );
        if (!editorRange) {
          return;
        }
        const textNode = editorRange.endContainer; // 拿到末尾文本节点
        const endOffset = editorRange.endOffset; // 光标位置
        // 找出光标前的at符号位置
        const textNodeValue = textNode.nodeValue;
        const expRes = /@([^@]*)$/.exec(textNodeValue);
        if (expRes && expRes.length > 1) {
          editorRange.setStart(textNode, expRes.index);
          editorRange.setEnd(textNode, endOffset);
          editorRange.deleteContents(); // 删除草稿end
          const dom = this.createInsterData(person);
          this.insertHtmlAtCaret(
            dom,
            this.editorRange.selection,
            this.editorRange.range
          );
        } else { // 点击艾特符的时候执行这里
          editorRange.setStart(textNode, endOffset);
          editorRange.setEnd(textNode, endOffset);
          editorRange.deleteContents(); // 删除草稿end
          const dom = this.createInsterData(person);
          this.insertHtmlAtCaret(
            dom,
            this.editorRange.selection,
            this.editorRange.range
          );
        }
      }
    },

    insertHtmlEmojiAtCaret(html, selection, range) {
      if (range && selection) {
        // range.deleteContents()
        const el = document.createElement("div");
        if (typeof html === "string") {
          el.innerHTML = html;
        } else if (Array.isArray(html)) {
          html.forEach((item) => {
            el.appendChild(item);
          });
        } else {
          el.appendChild(html);
        }
        const frag = document.createDocumentFragment();
        let node;
        let lastNode;
        while ((node = el.firstChild)) {
          lastNode = frag.appendChild(node);
        }
        console.log(range);
        range.insertNode(frag);
        console.log(lastNode);
        if (lastNode) {
          // selection.extend(lastNode, 1); // 将选区的焦点移动到一个特定的位置。
          selection.collapseToEnd(); // 将当前的选区折叠到最末尾的一个点
        }
      }
    },
    //* paste function
    onPasteHandle(e) {
      // 如果剪贴板没有数据则直接返回
      if (!(e.clipboardData && e.clipboardData.items)) {
        return
      }
      // 用Promise封装便于将来使用
      return new Promise((resolve, reject) => {
        // 复制的内容在剪贴板里位置不确定，所以通过遍历来保证数据准确
        for (let i = 0, len = e.clipboardData.items.length; i < len; i++) {
          const item = e.clipboardData.items[i]
          // 文本格式内容处理
          if (item.kind === 'string') {
            item.getAsString((str) => {
              resolve(str)
            })
          // 图片格式内容处理
          } else if (item.kind === 'file') {
            // eslint-disable-next-line no-unused-vars
            const pasteFile = item.getAsFile()
            // 处理pasteFile
            // TODO(pasteFile)
          } else {
            reject(new Error('Not allow to paste this type!'))
          }
        }
      })
    },
    //* editor paste event
    async onPaste(e) {
      console.table(e.clipboardData.items)
      const result = await this.onPasteHandle(e)
      console.log(result)
    },
    onChangeJsEditor(text) {
      if(text) {
        this.$refs.jsEditorElement.setAttribute('aria-placeholder', '')
      } else {
        this.$refs.jsEditorElement.setAttribute('aria-placeholder', this.ariaPlaceholder)
      }
    },

    //* editor keyup event
    onInputText(e) {
      console.log('div-input==', e.target.innerHTML)
      this.onChangeJsEditor(e.target.innerHTML)
      // 这是输入了@，那就直接弹选人浮层
      this.doToggleDialog();
      console.log(this.editorRange);
      console.log('event==', e.code, e.shiftKey)
      if (e.code === "Digit2" && !e.shiftKey) {
        this.mockInput = false;
        console.log("输入@");
        this.getAllNewMembers()
      }
    },

    //* 插入的 data
    createInsterData(personArr) {
      const temp = [];

      for (const person of personArr) {
        const btn = document.createElement("a");
        btn.dataset.id = person.member_id;
        btn.dataset.mid = person.im_user_id;
        btn.dataset.name = person.member_name || person.name;
        // data-mid="${some.im_user_id}"
        // btn.type = "link";

        btn.contentEditable = false;

        btn.setAttribute("href", "javascript:void(0)");
        if(this.allowSelectMembers.length === personArr.length) {
          btn.textContent = ` &${person.member_name} `;
          btn.setAttribute('style', 'display:none')
          btn.setAttribute("class", "userHiddenSetClass");
        } else {
          btn.textContent = ` @${person.member_name} `;
          btn.setAttribute("class", "userSetClass");
        }
        // btn.setAttribute('style', 'display:none')
        btn.addEventListener(
          "click",
          () => {
            return false;
          },
          false
        );
        btn.tabindex = "-1";
        const bSpaceNode = document.createTextNode("\u200B"); // 不可见字符，为了放光标方便
        temp.push(btn);
        temp.push(bSpaceNode);
      }
      // 将所有添加进去@所有人
      if(this.allowSelectMembers.length === personArr.length) {
        const btn = document.createElement("a");
        btn.type = "link";
        btn.textContent = ` @所有人 `;
        btn.contentEditable = false;
        btn.setAttribute("class", "userSetAllClass");
        btn.setAttribute("href", "javascript:void(0)");
        btn.tabindex = "-1";
        const bSpaceNode = document.createTextNode("\u200B"); // 不可见字符，为了放光标方便
        temp.push(btn);
        temp.push(bSpaceNode);
      }
      return temp;
    },
    //* 在光标处 插入 html
    insertHtmlAtCaret(html, selection, range) {
      if (range && selection) {
        // range.deleteContents()
        const el = document.createElement("div");
        if (typeof html === "string") {
          el.innerHTML = html;
        } else if (Array.isArray(html)) {
          html.forEach((item) => {
            el.appendChild(item);
          });
        } else {
          el.appendChild(html);
        }
        const frag = document.createDocumentFragment();
        let node;
        let lastNode;
        while ((node = el.firstChild)) {
          lastNode = frag.appendChild(node);
        }
        range.insertNode(frag);
        if (lastNode) {
          selection.extend(lastNode, 1); // 将选区的焦点移动到一个特定的位置。
          selection.collapseToEnd(); // 将当前的选区折叠到最末尾的一个点
        }
      }
    },

    initData() {
      if (this.$refs.jsEditorElement) {
        this.$refs.jsEditorElement.textContent = "";
        this.onChangeJsEditor('')
      }

      this.allowSelectMembers = [];
      this.editor = null;
    },

    isFocus() {
      if (document.activeElement.id == "jsEditorElement") {
        console.log("txt2获得焦点");
      } else {
        console.log("txt2未获得焦点");
      }
    },
    appendEmoji(imgSrc) {
      const editor = this.$refs.jsEditorElement;
      if (editor) {
        this.isFocus()
        console.log(editor.focus);
        this.selectEmoji(imgSrc);
        // 删掉草稿start
        console.log('onChangeJsEditor')
        this.onChangeJsEditor('emoji')
      }
      this.hideEmoj();
    },

    hideEmoj() {
      this.visibleEmoj = false;
    },
    showEmoj() {
      this.visibleEmoj = true;
    },

    async getAllNewMembers() {
        // 获取members
      this.allowSelectMembers = groupMembers
        .filter(v=>v.member_id !== this.userInfo.member_id)
        .map((v) => {
          v.name = v.member_name;
          v.key = v.member_id;
          v.title = v.member_name;
          return v;
        });
      setTimeout(()=> {
        this.$refs.UserSelectModalDom.onOpen();
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.alt-icon {
  display: inline-block;
  width: 40px;
  height: 40px;
  padding: 5px;
  line-height: 1;
  font-size: 26px;
  cursor: pointer;
}
.emoji-img {
  width: 40px;
  height: 40px;
  padding: 5px;
  cursor: pointer;
}

#jsEditorElement {
  max-height: 60px;
  overflow-y: auto;
}
.detail {
  width: 620px;
  height: 100%;
  padding-bottom: 120px;
  position: relative;
  .send {
    position: absolute;
    width: 100%;
    min-height: 113px;
    bottom: 0;
    z-index: 3;
    background: #ffffff;
    border: 1px solid #f00;
    box-shadow: 0 -4px 12px -3px rgba(0, 0, 0, 0.06);
    // box-shadow: 0px 2px 18px 0px rgba(0,0,0,0.20);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    &-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      .operate {
        display: flex;
        align-items: center;
      }
    }
    &-body {
      transition: all 0.2s;
      padding: 0 20px;
    }
  }
}

.emoji-panel {
  display: grid;
  grid-template-columns: repeat(10, 40px);
  div {
    cursor: pointer;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    &:hover {
      background: #e3f1ff;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.textareamock {
  border: 1px solid #000;

  min-height: 60px;
  width: 100%;
  border-radius: 4px;
  padding: 10px 10px;
}

.textareamock::after {
	content:attr(aria-placeholder);
  color: #cccaca;
  cursor: text;
}


.textareamock:focus:before {
  content: none;
}
.textareamock:hover {
  border-color: #40a9ff;
  border-right-width: 1px !important;
}
.textareamock:focus-visible {
  border-color: #40a9ff;
  border-right-width: 1px !important;
  outline: none;
}
</style>
