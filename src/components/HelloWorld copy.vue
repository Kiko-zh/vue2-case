<template>
  <div class="detail">
    <div
      class="detail-banner"
      v-show="activeTaskItemID"
    >
      <div class="an-box">
        <a-anchor
          class="fl"
          :target-offset="20"
          :get-container="() => $refs.formBox"
          :affix="false"
          :show-ink-in-fixed="false"
        >
          <a-anchor-link
            href="#detail"
            title="任務詳情"
          >

          </a-anchor-link>
          <a-anchor-link
            href="#dynamic"
            title="評論/動態"
          >

          </a-anchor-link>
        </a-anchor>
      </div>
      <span
        class="toRight"
        v-if="task"
      >
        <span
          class="collect"
          @click="isCollectedClickHandle"
        >
          <i
            class="iconfont f24"
            v-show="!task.is_follow"
          >&#xe66c;</i>
          <i
            class="iconfont f24"
            style="color: #2176FF!important"
            v-show="task.is_follow"
          >&#xe65d;</i>
          <!-- <i class="iconfont f24">&#xe65d;</i> -->
        </span>
        <span
          class="edit"
          v-clickoutside="outsideClose"
        >
          <i
            class="iconfont f24 iconfontOne"
            @click="isDownShow = !isDownShow"
          >&#xe683;</i>
          <div
            class="down"
            v-show="isDownShow"
          >
            <span
              class="down-item"
              @click="copyTaskHandle"
            >
              <i class="iconfont f16">&#xe676;</i>複製任務
            </span>
            <span
              class="down-item"
              @click="delTaskHandle"
            >
              <i class="iconfont f16">&#xe675;</i>刪除任務
            </span>
          </div>
        </span>
      </span>

    </div>

    <div
      class="detail-body"
      ref="formBox"
      :style="setHeight"
      v-show="activeTaskItemID"
    >
      <div
        class="detail-body-form"
        id="detail"

      >
        <span  v-if="task">
          <div :class="{formItem: true, formEditItem: formSet.title_show}">
            <span class="formItem-label">
              <i class="iconfont f14">&#xe701;</i>主題
            </span>
            <span
              :class="{'formItem-text': true, noEdit: !isCanEdit}"
              @click="exchangeEditTitle"
              v-show="!formSet.title_show"
            >
              <a-tooltip placement="top" v-show="isCanEdit">
                <template slot="title">
                  <span>點擊即可編輯</span>
                </template>
                {{task.title}}
              </a-tooltip>
              <span v-show="!isCanEdit">{{task.title}}</span>
            </span>
            <span
              class="formItem-textarea"
              v-show="formSet.title_show"
            >
              <a-input
                placeholder="輸入主題"
                v-model="formSet.title_text"
                :max-length="100"
              ></a-input>
              <span class="operate">
                <span
                  class="cancel"
                  @click="onCancelTitle"
                >取消</span>
                <span
                  @click="onSaveTitle"
                  :class="{sure: true, disable_sure: !formSet.title_text}"
                >保存</span>
              </span>
            </span>

          </div>
          <div class="formItem">
            <span class="formItem-label">
              <i class="iconfont f14">&#xe70d;</i>狀態
            </span>
            <span
              v-show="!task.complete_status"
              :class="{'formItem-unbtnFinish': true, noEdit: !isCanEdit}"
              @click="finishClickHandle"
            >
              <span class="formItem-unbtnFinish-select">
              </span>
              <span class="formItem-unbtnFinish-val">
                未完成
              </span>
            </span>
            <span
              v-show="task.complete_status"
              :class="{'formItem-btnFinish': true, noEdit: !isCanEdit}"
              @click="finishedClickHandle"
            >
              <!-- <span class="formItem-btnFinish-select">
                </span> -->
              <i class="iconfont f16">&#xe636;</i>
              <span class="formItem-btnFinish-val">
                已完成
              </span>
            </span>
            <i
              v-show="task.complete_text"
              class="iconfont f20"
              @click="lookFinishInfoHandle"
              style="margin-left: 10px; color:#2176ff; cursor:pointer"
            >&#xe71a;</i>

          </div>
          <div class="formItem">
            <span class="formItem-label">
              <i class="iconfont f14">&#xe729;</i>時間
              <a-tooltip placement="top">
                <template slot="title">
                  <span>清除時間会同时清除重复周期</span>
                </template>
                <i
                  class="iconfont"
                  style="color: #aaa"
                >&#xe650;</i>
              </a-tooltip>
            </span>
            <span class="formItem-time">
              <span class="formItem-time-left">
                <!-- format('YYYY-MM-DD HH:mm') -->
                {{task.start_date ? formatDateText(task.start_date)+isShowEndText('start') : '設置开始時間'}}
                <i
                  :class="{iconfont:true, toLeftX:true, f20:true, noEdit: !isCanEdit}"
                  @click="removeStartDate"
                >&#xe6aa;</i>
                <!-- @change="(val)=>listenTimeHandle(val, 'start')" -->
                <a-date-picker
                  class="date"
                  :disabled="!isCanEdit"
                  v-model="task.start_date_edit"
                  :showToday="false"
                  :showTime="{minuteStep: 5, format: 'HH:mm'}"
                  placeholder="選擇開始時間"
                  :format="'YYYY-MM-DD HH:mm'"
                  @ok="(val)=>listenTimeHandleOk(val, 'start')"
                />
              </span>
              <span>&nbsp;-&nbsp;</span>

              <span class="formItem-time-right">
                {{task.end_date ? formatDateText(task.end_date)+isShowEndText('end') : '設置结束時間'}}
                <i
                  :class="{iconfont:true, toRightX:true, f20:true, noEdit: !isCanEdit}"
                  @click="removeEndDate"
                >&#xe6aa;</i>
                <a-date-picker
                  class="date"
                  :showToday="false"
                  v-model="task.end_date_edit"
                  :disabled="!isCanEdit"
                  :showTime="{minuteStep: 5, format: 'HH:mm'}"
                  placeholder="選擇結束時間"
                  :format="'YYYY-MM-DD HH:mm'"
                  @ok="(val)=>listenTimeHandleOk(val, 'end')"
                />
              </span>
            </span>

          </div>
          <div class="formItem">
            <span class="formItem-label">
              <i class="iconfont f14">&#xe62e;</i>提醒時間
            </span>
            <TipTimeCompo
              :fromType="'detail'"
              :disabled="!this.isCanEdit"
              @sendTipTime="sendTipTime"
              :activeItem.sync="activeTipItem"
            />

          </div>
          <div class="formItem">
            <span class="formItem-label">
              <i class="iconfont f14">&#xe700;</i>負責人
            </span>

            <span class="formItem-value">
              <div :class="{leading:true, noEdit: !isCanEdit}">
                <span
                  v-show="!leadingItem"
                  class="leading-add"
                  @click="handleAddLeading"
                >添加</span>
                <span
                  v-if="leadingItem"
                  class="leading-item"
                  style="line-height: 18px;"
                >
                  <img
                    v-if="leadingItem.member_avatar"
                    :src="leadingItem.member_avatar"
                  />
                  <div
                    v-else
                    class="box"
                  >
                    {{ getNameContent(leadingItem.member_name) }}
                  </div>
                  {{leadingItem.member_name}}<i
                    :class="{iconfont:true, hanDel:true ,f14: true, noEdit: !isCanEdit}"
                    @click="handleDelLeading"
                  >&#xe644;</i>
                </span>
              </div>
            </span>
          </div>
          <div class="formItem">
            <span class="formItem-label">
              <i class="iconfont f14">&#xe70b;</i>重復週期
            </span>
            <span class="formItem-value">
              <span
                :class="{repet:true, noEdit: (!isCanEdit) || (!task.cycle_update)}"
                @click="setRepetPeriod"
              >
                {{repeatCycleCtd}}
              </span>
            </span>
          </div>
          <div class="formItem">
            <span class="formItem-label">
              <i class="iconfont f14">&#xe720;</i>項目
            </span>
            <span class="formItem-value">

              <span
                class="setProjectText "
                v-show="!formSet.project_show"
              >

                <span class="ellipsis1">{{taskProjectNameCtd}}</span>

                <i
                  class="iconfont toX f20"
                  v-if="task.project_id"
                  @click="delProject"
                >&#xe6aa;</i>
              </span>


              <a-select
                v-model="task.project_id"
                class="setProjectSelect"
                :disabled="!isCanEdit"
                placeholder="添加項目"
                @change="listenProjectSelect"
              >
                <a-select-option
                  v-for="item in projectList"
                  :key="item.project_id"
                  :value="item.project_id"
                >

                  {{ item.project_name }}
                </a-select-option>
              </a-select>

            </span>
          </div>

          <div :class="{formItem: true, formEditItem: formSet.address_show}">
            <span class="formItem-label">
              <i class="iconfont f14">&#xe6fe;</i>地點
            </span>

            <span
              :class="{'formItem-textTwo': true, noEdit: !isCanEdit}"
              @click="exchangeEditAddress"
              v-show="!formSet.address_show"
            >
              <a-tooltip placement="top" v-if="isCanEdit">
                <template slot="title">
                  <span>點擊即可編輯</span>
                </template>
                <span class="addText">
                {{task.place ? task.place : '添加地點'}}
                </span>
              </a-tooltip>
              <span class="addText" v-else>
                {{task.place ? task.place : '添加地點'}}
              </span>
            </span>

            <span
              class="formItem-textarea"
              v-show="formSet.address_show"
            >
              <a-input
                placeholder="輸入地點"
                v-model="formSet.address_text"
                :max-length="100"
              ></a-input>
              <span class="operate">
                <span
                  class="cancel"
                  @click="onCancelAddress"
                >取消</span>
                <!-- , disable_sure: !formSet.address_text -->
                <span
                  @click="onSaveAddress"
                  :class="{sure: true}"
                >保存</span>
              </span>
            </span>

          </div>

          <div class="formItem">
            <span class="formItem-label">
              <i class="iconfont f14">&#xe70c;</i>優先級
            </span>
            <span class="formItem-value">
              <PriorityCompo
                :activeKey.sync="task.priority"
                :fromType="'detail'"
                :fromOrigin="fromOrigin"
                :disabled="!isCanEdit"
                @updateActiveKeyHandle="updatePriorityHandle"
                @setPriorityListHandle="setPriorityListHandle"
              />
            </span>

          </div>
          <!-- 事项 -->
          <div :class="{formItem: true, formEditItem: true}">
            <span class="formItem-label">
              <i class="iconfont f14">&#xe705;</i>事項
            </span>
            <!-- <span

            > -->
            <a-tooltip placement="top" v-if="isCanEdit">
              <template slot="title">
                <span>點擊即可編輯</span>
              </template>
              <pre
                :class="{'formItem-textTwo':true, noEdit: !isCanEdit}"
                @click="exchangeEditMatter"
                v-show="!formSet.matter_show"
              >{{task.matter || '添加事項'}}</pre>
            </a-tooltip>
            <span v-else>
              <pre
                  :class="{'formItem-textTwo':true, noEdit: !isCanEdit}"
                  @click="exchangeEditMatter"
                  v-show="!formSet.matter_show"
                >{{task.matter || '添加事項'}}</pre>
            </span>
            <!-- </span> -->
            <span
              class="formItem-textarea"
              v-show="formSet.matter_show"
            >
              <a-textarea
                placeholder="輸入事項"
                v-model="formSet.matter_text"
                style="height: 110px;"
              ></a-textarea>
              <span class="operate">
                <span
                  class="cancel"
                  @click="onCancelMatter"
                >取消</span>
                <!-- , disable_sure: !formSet.matter_text -->
                <span
                  @click="onSaveMatter"
                  :class="{sure: true}"
                >保存</span>
              </span>
            </span>

          </div>

          <div class="formItem formEditItem">
            <span class="formItem-label">
              <i class="iconfont f14">&#xe704;</i>圖片
            </span>
            <span class="formItem-images">
              <UploadImageCompo
                :imgList="task.images"
                :disabled="!isCanEdit"
                fromType="detail"
                class="baseInputWidth"
                @sendUpdateImage="sendUpdateImage"
              />
            </span>
          </div>
          <div
            class="formItem formEditItem"
            style="margin-bottom: 8px;"
          >
            <span class="formItem-label">
              <i class="iconfont f14">&#xe715;</i>附件
            </span>
            <span class="formItem-images">
              <UploadFileCompo
                :fileList="task.attachment"
                :disabled="!isCanEdit"
                @sendUpdateUpload="sendUpdateUpload"
                class="baseInputWidth"
                :fromType="'detail'"
              />
            </span>
          </div>
          <div class="formItem formEditItem">
            <span
              class="formItem-label"
              style="margin-top:5px;"
            >
              <i class="iconfont f14">&#xe6fc;</i>標簽
            </span>
            <span class="formItem-images">
              <TagsCompo
                :fromOrigin="fromOrigin"
                :fromType="'detail'"
                :tags.sync="task.tags"
                :tagsList.sync="tagsList"
                :disabled="!isCanEdit"
                @sendTagsUpdate="sendTagsUpdate"
                class="baseInputWidth"
              />
            </span>
          </div>
          <div class="formItem formEditItem">
            <!-- <span class="formItem-label" style="margin-top:5px;">
              <i class="iconfont f14">&#xe701;</i>子任務
            </span> -->

            <DetailSubTaskCompo
              class="baseInputWidth"
              style="width:100%;"
              :disabled="!isCanEdit"
              :fromOrigin="fromOrigin"
              :subTasksOrigin.sync="task.subtask"
              :activeTaskItemID="activeTaskItemDetailID"
              @sendReloadComment="sendReloadData"
            />
          </div>
          <div
            class="formItem formEditItem"
            style="flex-direction: column;"
          >
            <div class="formItem-part">
              參與人<span v-show="participants.length > 0">（{{participants.length}}）</span>

              <a-tooltip placement="top">
                <template slot="title">
                  <span>參與人可參與評論和任務跟進</span>
                </template>
                <i
                  class="iconfont"
                  style="color: #aaa"
                >&#xe650;</i>
              </a-tooltip>
              <span
                :class="{'leading-addTwo': true, addBtns:true, noEdit: !isCanEdit}"
                style="margin-left: 8px;"
                @click="handleAddParticipants"
              >
                <i class="iconfont addIcon f14">&#xe663;</i>
              </span>
            </div>
            <div
              class="leading"
              style="margin-top: 15px;"
            >

              <span
                class="leading-item partcss"
                v-for="(part, partIndex) in participants"
                :key="partIndex"
              >
                <img
                  v-if="part.member_avatar"
                  :src="part.member_avatar"
                />
                <div
                  v-else
                  class="box"
                >
                  {{ getNameContent(part.member_name) }}
                </div>
                {{part.member_name}}
                <i
                  v-show="part.member_id !== task.creator"
                  :class="{iconfont:true, f14:true, hanDel:true, noEdit: !isCanEdit}"
                  @click="handleDelPart(part)"
                >&#xe644;</i>
              </span>
            </div>

          </div>
        </span>
      </div>

      <div
        class="comment"
        id="dynamic"
      >
        <div class="comment-screen">
          <span
            @click="onSrcClick(0)"
            :class="{scr:true, scrActive: scrActive === 0}"
          >所有動態</span>
          <span
            @click="onSrcClick(1)"
            :class="{scr:true, scrActive: scrActive === 1}"
          >評論</span>
        </div>
        <div class="comment-btn">
          <span
            class="load"
            @click="loadPrevScreen"
            v-show="taskCommentsCount > 10 && taskComments.length < taskCommentsCount"
          >載入之前的評論/動態</span>
        </div>
        <div class="comment-list">
          <div
            v-for="com in taskComments"
            :key="com.id"
          >
            <span
              class="trends"
              v-if="com.type === 1"
            >
              <span class="icon setIcon">
                <!-- 创建任务 -->
                <i
                  v-show="com.dynamic_type===1"
                  class="iconfont"
                >&#xe701;</i>

                <i
                  v-show="com.dynamic_type===2"
                  class="iconfont f14"
                >&#xe70d;</i>

                <i
                  v-show="com.dynamic_type===3"
                  class="iconfont f14"
                >&#xe701;</i>
                <i
                  v-show="com.dynamic_type===4 || com.dynamic_type===5"
                  class="iconfont f14"
                >&#xe729;</i>
                <i
                  v-show="com.dynamic_type===6"
                  class="iconfont f14"
                >&#xe700;</i>
                <i
                  v-show="com.dynamic_type===7"
                  class="iconfont f14"
                >&#xe70b;</i>

                <i
                  v-show="com.dynamic_type===8"
                  class="iconfont f14"
                >&#xe720;</i>
                <i
                  v-show="com.dynamic_type===9"
                  class="iconfont f14"
                >&#xe6fe;</i>
                <i
                  v-show="com.dynamic_type===10"
                  class="iconfont f14"
                >&#xe70c;</i>
                <i
                  v-show="com.dynamic_type===11"
                  class="iconfont f14"
                >&#xe705;</i>
                <i
                  v-show="com.dynamic_type===12"
                  class="iconfont f14"
                >&#xe704;</i>

                <i
                  v-show="com.dynamic_type===13"
                  class="iconfont f14"
                >&#xe715;</i>
                <i
                  v-show="com.dynamic_type===14"
                  class="iconfont f14"
                >&#xe6fc;</i>
                <i
                  v-show="com.dynamic_type===17 || com.dynamic_type===15"
                  class="iconfont f14"
                >&#xe70e;</i>
                <i
                  class="iconfont f14"
                  v-show="com.dynamic_type===18"
                >&#xe62e;</i>
              </span>
              <span class="desc" style="margin-left: 5px;">
                <span class="desTop">
                  <span class="desTop-name ellipsis1">
                    {{com.member.member_name}} {{com.content.title}}
                  </span>
                  <span class="desTop-time"  v-if="com.created_at">
                    {{com.created_at}}
                  </span>

                </span>
                <span
                  class="desc-it"

                  v-if="com.content"
                >{{com.content.text}}</span>
              </span>
            </span>
            <span
              class="trends"
              v-else-if="com.type===2"
            >
              <span class="icon">
                <img
                  v-if="com.member.member_avatar"
                  :src="com.member.member_avatar"
                />
                <div
                  v-else
                  class="boxss"
                >
                  {{ getNameContent(com.member.member_name) }}
                </div>

              </span>
              <span class="desc">
                <span class="desTop">
                  <span class="desTop-name">
                    {{com.member.member_name}} {{com.content.title}}
                    <span
                      class="cancelSet"
                      v-show="com.can_withdraw"
                      @click="rollbackComment(com)"
                    >撤回</span>
                  </span>

                  <span
                    class="desTop-time"
                    v-if="com.created_at"
                  >
                    {{com.created_at}}
                  </span>
                </span>
                <span
                  class="desc-it descComment"
                  v-if="com.content && (com.content.text ||  com.content.attachment.length > 0)"
                >
                  <span v-html="com.content.text"></span>
                  <div class="files">
                    <span
                      class="files-item"
                      v-for="(atItem, atItemIndex) in com.content.attachment"
                      :key="atItemIndex"
                    >
                      <span
                        class="icons"
                        @click="thumbnailView(atItem)"
                      >
                        <PzyIcon
                          :style="{fontSize: '36px' }"
                          :type="fileIconName(atItem.original_name)"
                        />
                      </span>
                      <span
                        class="name ellipsis1"
                        @click="thumbnailView(atItem)"
                      >
                        {{atItem.original_name}}
                      </span>
                      <i class="iconfont downIcon f16" @click="downFileDone(atItem)">&#xe613;</i>
                    </span>
                  </div>
                </span>
                <div
                  class="images-list descImage"
                  v-if="com.content"
                >
                  <span
                    class="item descImage-item"
                    v-for="(imgItem, imgIndex) in com.content.images"
                    :key="imgIndex"
                  >
                    <img
                      v-lazy="imgItem.file_name"
                      alt=""
                      @click="preViewImage(imgItem, com.content.images)"
                    >
                    <!-- <span
                      class="x"
                      @click="delImgHandle(imgIndex)"
                    >
                      <i class="iconfont f16 x-icon">&#xe6aa;</i>
                    </span> -->
                  </span>
                </div>
              </span>

            </span>

          </div>
        </div>
      </div>
      <!-- 选人 单选负责人 -->
      <UserSelectDualMode
        ref="memberSelect"
        title="選擇人員"
        :visible.sync="userSelectModalVisible"
        :fromOrigin="fromOrigin"
        :single-select="true"
        @ok="saveChecked"
        :projectId="0"
      />
      <!-- 选人 多选负责人 -->
      <UserSelectDualMode
        ref="memberMultipSelect"
        title="選擇人員"
        :fromOrigin="fromOrigin"
        :banIds="partBanIds"
        :visible.sync="userMultipSelectModalVisible"
        @ok="saveMultipChecked"
        :projectId="0"
      />
      <FinishModelModal
        ref="FinishModelModalDom"
        :tag.sync="timeTag"
        :editText="editText"
        @setModalNameHandle="setCompleteHandle"
      />
      <!-- 重复周期 -->
      <RepetPeriodModal
        ref="RepetPeriodModalDom"
        :repeatCycle.sync="repeatCycle"
        @sendMessage="updateRepetPeriodInfo"
      />
    </div>

    <div
      class="send"
      v-show="activeTaskItemID"
    >
      <div class="send-body">
        <a-popover
          v-model="visibleAlt"
          trigger="click"
          overlayClassName="alt"
          placement="topLeft"
          @visibleChange="visibleChangeAlt"
        >
          <div
            class="alt-panel"
            slot="content"
            v-if="task&& task.members && task.members.length > 0"
          >
            <div
              v-for="(member, index) in task.members"
              :key="index"
              class="leading-item alt-panel-item"
              style="line-height: 18px;"
            >
              <img
                v-if="member.member_avatar"
                :src="member.member_avatar"
              />
              <div
                v-else
                class="box"
              >
                {{ getNameContent(member.member_name) }}
              </div>
              {{member.name}}
              <!-- <i class="iconfont f14">&#xe644;</i> -->
            </div>
          </div>
          <div v-show="visibleAlt"></div>

        </a-popover>
        <!-- <quill-editor
          style="height: 100px;"
          v-model="contentQ"
          :options="editorOption"
          @change="onEditorChange($event)"
          ref="myQuillEditors"
        >
        </quill-editor> -->
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
        <div class="images-list">
          <span
            class="item"
            v-for="(imgItem, imgIndex) in imgList"
            :key="imgIndex"
          >
            <img
              v-lazy="imgItem.file_name"
              alt=""
              @click="preViewImage(imgItem, imgList)"
            >
            <span
              class="x"
              @click="delImgHandle(imgIndex)"
            >
              <i class="iconfont f16 x-icon">&#xe6aa;</i>
            </span>
          </span>
        </div>
        <div
          class="fileDetail"
          v-if="fileList && fileList.length > 0"
        >
          <span
            class="itemDetail"
            v-for="(imgItem, imgIndex) in fileList"
            :key="imgIndex"
          >
            <!-- <span class="item-left" >
          </span> -->
            <span
              class="icon"
              @click="thumbnailView(imgItem)"
            >
              <PzyIcon
                :style="{fontSize: '36px' }"
                :type="fileIconName(imgItem.original_name)"
              />
            </span>
            <span
              class="name ellipsis1"
              @click="thumbnailView(imgItem)"
            >
              {{imgItem.original_name}}
            </span>
            <!-- <span class="item-right">
            &#xe678;
          </span> -->
            <!-- <i class="iconfont downIcon f16">&#xe678;</i> -->
            <i
              class="iconfont delIcon f16"
              style="margin-left: 10px"
              @click="() => {
                   fileList.splice(imgIndex, 1)
              }"
            >&#xe644;</i>
          </span>
        </div>
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
                <img :src="src" />
              </div>
            </div>
            <i
              class="iconfont op f24"
              @click="showEmoj"
            >&#xe716;</i>
          </a-popover>
          <a-upload
            :show-upload-list="false"
            :multiple="true"
            :custom-request="uploadImage"
            :before-upload="beforeUploadImage"
          >
            <i class="iconfont op f24">&#xe717;</i>
          </a-upload>

          <a-upload
            :show-upload-list="false"
            :multiple="true"
            :custom-request="uploadFile"
            :before-upload="beforeUploadFile"
          >
            <i class="iconfont op f24">&#xe715;</i>
          </a-upload>

          <i
            class="iconfont op f24"
            @click="appendAltClick"
          >&#xe714;</i>
        </span>
        <span
          :class="{sure: true, disable_sure: false}"
          style="padding: 7px 30px;"
          @click="publishHandle"
        >發送</span>

      </div>

    </div>
    <!-- 空白页 -->
    <div
      class="emptyShow"
      v-show="!activeTaskItemID"
    >
      <img
        alt
        class="image"
        src="../../../assets/img/no_data.png"
      />
      <div class="tips">點擊任務標題查看詳情</div>
    </div>
    <UserSelectModal
      @ok="saveMembers"
      ref="UserSelectModalDom"
      :members="allowSelectMembers"
    ></UserSelectModal>
    <CopyTaskModal
      ref="CopyTaskModalDom"
      :fromOrigin="fromOrigin"
      @sendMessage="$emit('sendMessage', true)"
      :activeTaskItemID="activeTaskItemDetailID"
    />
    <ImageView
      ref="imageSingleView"
      :src="src"
    />
    <preview
      ref="imageView"
      :src="src"
      :imgList="showImgList"
    />
  </div>
</template>

<script>
const switchWeek = (arrStr) => {
  let arr = arrStr.split(",");
  arr = arr.map((v) => {
    let str = "";
    switch (Number(v)) {
      case 1:
        str = "一";
        break;
      case 2:
        str = "二";
        break;
      case 3:
        str = "三";
        break;
      case 4:
        str = "四";
        break;
      case 5:
        str = "五";
        break;
      case 6:
        str = "六";
        break;
      case 7:
        str = "日";
        break;

      default:
        break;
    }
    return str;
  });
  return arr.join("、");
};
/**
 * funct @sendMessage
 */
import preview from "@/components/preview";
// import { quillEditor, Quill } from "vue-quill-editor";
import { emojiSrcList, emojiList } from "@/common/constant";
import { formatDateText } from "@/common/utils";

import DetailSubTaskCompo from "@/components/rebook/task/common/DetailSubTaskCompo";
import TagsCompo from "@/components/rebook/task/common/TagsCompo";
import { v4 as uuidv4 } from "uuid";
import UploadFileCompo from "@/components/rebook/task/common/UploadFileCompo";
import UploadImageCompo from "@/components/rebook/task/common/UploadImageCompo";
import PriorityCompo from "@/components/rebook/task/common/PriorityCompo";
import RepetPeriodModal from "@/components/rebook/task/modal/RepetPeriodModal";
import UserSelectDualMode from "@/components/projectOrganization/userSelectDualMode";
import TipTimeCompo from "@/components/rebook/task/common/TipTimeCompo";
import FinishModelModal from "@/components/rebook/task/modal/FinishModelModal";
import CopyTaskModal from "@/components/rebook/task/modal/CopyTaskModal";
import UserSelectModal from "@/components/rebook/task/modal/UserSelectModal";
import moment from "moment";
import {
  fileIconName,
  // eslint-disable-next-line no-unused-vars
  enderSize,
} from "@/components/approvalProcess/freeFormDesign/freeFormFieldsPC/uploadUtil";
import ThumbnailViewMixins from "@/components/rebook/task/mixins/ThumbnailViewMixins";

// import NodeBlot from "@/common/NodeBlot";

// Quill.register(NodeBlot); // 插入图片

// const Delta = Quill.import("delta");
import { uploadUrl } from "@/common/api";
// const IMUrl = process.env.IMUrl;
const ImageView = {
  props: {
    src: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      modalVisible: false,
      partBanIds: [],
    };
  },
  methods: {
    open() {
      this.modalVisible = true;
    },
    close() {
      this.modalVisible = false;
    },
  },
  render() {
    return (
      <a-modal
        class="imgPreview"
        footer={null}
        bodyStyle={{ padding: 0, margin: 0 }}
        width={"auto"}
        centered={true}
        vModel={this.modalVisible}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ padding: "50px" }}>
            <img
              src={this.src}
              onClick={() => {
                this.close();
              }}
              style={{ width: "100%", maxWidth: "980px", maxHeight: "850px" }}
            />
          </div>
        </div>
      </a-modal>
    );
  },
};
export default {
  name: "detailDomCompo",
  components: {
    ImageView,
    UserSelectModal,
    CopyTaskModal,
    // quillEditor,
    DetailSubTaskCompo,
    TagsCompo,
    UploadFileCompo,
    UploadImageCompo,
    PriorityCompo,
    RepetPeriodModal,
    UserSelectDualMode,
    TipTimeCompo,
    FinishModelModal,
    preview,
  },
  props: {
    activeTaskItemID: {
      type: Number,
      default: 0,
    },
    fromOrigin: { // 来源 ， 用于辨别来自日程schedule或者任务默认为空
      type: String,
      default: ''
    }
  },
  mixins: [ThumbnailViewMixins],
  watch: {
    activeTaskItemID: {
      handler(val) {
        if (val) {
          // this.tagShow = true;
          this.initData();
          this.getTagsData();
          this.getProjectList();
          this.getTaskDetail(this.activeTaskItemDetailID);
          // this.taskComments = [];
          this.pageComment.page = 1;
          this.getTaskComment(this.activeTaskItemDetailID);
        } else {
          // this.tagShow = false;
        }
      },
      immediate: true,
    },
  },

  computed: {
    scheduleInstitution() {
      return this.$store.state.schedule.scheduleInstitution
    },
    // 是否可编辑
    isCanEdit() {
      return this.task && this.task.is_edit;
    },
    activeTaskItemDetailID() {
      return this.$store.state.task.currentTaskDetailID;
    },
    userInfo() {
      return this.$store.state.user.user || null;
    },
    repeatCycleCtd() {
      let msg = "設置";
      if (this.repeatCycle) {
        switch (this.repeatCycle.type) {
          case 1: // 每天
            msg = "每天的" + this.repeatCycle.time[0] + "生成";
            break;
          case 2: // 每周
            msg =
              "每週" +
              switchWeek(this.repeatCycle.time[0]) +
              "的" +
              this.repeatCycle.time[1] +
              "生成";
            break;
          case 3: // 每月
            msg =
              "每个月的第" +
              this.repeatCycle.time[0] +
              "天" +
              this.repeatCycle.time[1] +
              "生成";
            break;
          case 4: // 每年
            msg =
              "每年的" +
              this.repeatCycle.time[0] +
              "月" +
              this.repeatCycle.time[1] +
              "日" +
              this.repeatCycle.time[2] +
              "生成";
            break;

          default:
            break;
        }
      }
      return msg;
    },
    taskProjectNameCtd() {
      let msg = "添加項目";
      if (this.task && this.task.project_id) {
        let obj = this.projectList.find((v) => v.project_id === this.task.project_id);
        msg = obj ? obj.project_name : "添加項目";
      }
      return msg;
    },
    setHeight() {
      let height = 280;
      if (this.imgList.length > 2) {
        height = height + 100;
      }
      if (this.fileList.length > 2) {
        height = height + 100;
      }
      return {
        height: `calc(100vh - ${height}px)`,
      };
    },
  },

  data() {
    return {
      src: "",
      showImgList: [],
      imgList: [],
      fileList: [],
      emojiSrcList,
      emojiList,
      allowSelectMembers: [], // 存储评论可以选择的人
      partBanIds: [],
      visibleEmoj: false,
      visibleAlt: false,
      selectedAlt: false,
      currentAltPosition: 0,

      contentQ: "",
      editorOption: {
        placeholder: "请输入",
        modules: {
          toolbar: {
            container: [],
          },
        },
      },
      editor: null,

      userSelectModalVisible: false,
      userMultipSelectModalVisible: false,
      projectList: [], // 项目列表
      timeTag: 0, // 完成情况创建或编辑
      editText: "", // 完成情况编辑的内容
      activeTab: 1,
      isCollected: false, // 是否收藏
      isDownShow: false,
      scrActive: 0, // 0 所有动态，1评论
      activeTipItem: { key: 1, text: "不提醒" }, // 提醒時間选择
      leadingItem: null, // 负责人对象
      repeatCycle: null, // 重复周期
      participants: [], // 参与人对象列表
      itemPriorityList: [], // 优先级列表
      tagsList: [],
      taskComments: [],
      taskCommentsCount: 0,

      pageComment: {
        page: 1,
        pageSize: 10,
      },

      // tagShow: false,
      formSet: {
        title_show: false, //  是否编辑状态
        title_text: "", //

        project_show: false, // 展开项目

        address_show: false, // 地点
        address_text: "",

        matter_show: false,
        matter_text: "", // 事项
      },

      // 创建任务
      task: null,
      mockInput: false,
      editorRange: null,
      ariaPlaceholder: '@參與人將通過聊天發給對方'
    };
  },

  mounted() {
    // this.editor = new Quill(this.$refs.myQuillEditors)
    // this.editor = this.$refs.myQuillEditors.quill;
    // // this.setEditorOption()
    // const that = this;
    // this.editor.on('text-change', (delta, oldDelta, source) => {
    //   console.log(delta.ops)
    //   // console.log(oldDelta)
    //   // console.log(source)
    //   that.listenDeltaByAlt(delta)
    // })
  },

  methods: {
    moment,
    fileIconName,
    formatDateText,
    isShowEndText(type) {
      if(type === 'start') {
        if(this.task.start_date && (!this.task.end_date)) {
          return ' 開始'
        }
      } else {
        if(this.task.end_date && (!this.task.start_date)) {
          return ' 截止'
        }
      }
      return ''
    },

    downFileDone(item) {
      console.log('item==', item)
      // saveAs(item.file_name, item.original_name)
    },
    listenSendFooter() {
      // console.log(this.editorRange.range)
      const editor = this.$refs.jsEditorElement;
      if (editor) {
        editor.focus();
        this.doToggleDialog();
        // console.log(editor)
        // this.editorRange.moveStart("character", 10);
        // this.editorRange.collapse(true);
        // this.editorRange.select();
        console.log(this.editorRange.range)
      }
    },
    // 撤回
    rollbackComment(com) {
      const that = this;
      this.$confirm({
        title: "提示",
        okText: "確定",
        cancelText: "取消",
        icon: () => (
          <a-icon
            type="exclamation-circle"
            style="color:#FAAD14"
            theme="filled"
          />
        ),
        content: () => (
          <div style="font-size:14px;color:#333333">確定要撤回評論嗎？</div>
        ),
        onOk() {
          that.rollbackAxiosComment(com);
        },
      });
    },
    async rollbackAxiosComment(com) {
      const res = await this.$axios.post("task/dynamic/withdraw", {
        id: com.id,
        institution: this.fromOrigin==="schedule"? this.scheduleInstitution : localStorage.getItem("institution")
      });
      if (res.code === 0) {
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
      setTimeout(() => {
        this.setInitCommentList();
      }, 1500);
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
      if (this.activeTaskItemID && this.task) {
        // 解析文本内容
        let ressome = "";
        const atidsss = [];
        const atnames = [];
        const atmid = [];
        ressome = this.$refs.jsEditorElement.innerHTML;
        if (!ressome || !ressome.length) {

          if(this.imgList < 1 && this.fileList < 1) {
            this.$message.warning("請輸入評論內容");
            // this.confirmLoading = false
            return false;
          }


        }
        console.log(this.$refs.jsEditorElement.innerHTML);
        const editor = this.$refs.jsEditorElement;
        // console.log(children)
        // for (const child of children) {
        //   atidsss.push(child.dataset.id);
        //   atnames.push(child.dataset.name);
        // }
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
        console.log(params.text)
        console.log(params.imText)

        // return;
        // return;
       
        params.institution = this.fromOrigin==="schedule"? this.scheduleInstitution : localStorage.getItem("institution")
        const res = await this.$axios.post("task/dynamic/comment", params);
        if (res.code === 0) {
          this.$message.success(res.msg);
          setTimeout(() => {
            this.setInitComment();
            if (this.$refs.jsEditorElement) {
              this.$refs.jsEditorElement.textContent = "";
              this.onChangeJsEditor('')
            }
          }, 1000);

          // 在这里做IM数据发送
          this.sendIMMessage(atmid ? atmid.filter((v) => v) : [], params.imText, atmid);
        } else {
          this.$message.error(res.msg);
        }
      } else {
        this.$message.error("请选择任务");
      }
    },
    sendIMMessage(friends, text, atUserIds) {
      // 获取当前用户id
      const userID = this.userInfo ? this.userInfo.im.user_id : 0;
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
        // xmlhttp.onload = function () {
        //   if (this.status == 200) {
        //     resolve(this.response);
        //   } else {
        //     reject(this.status);
        //   }
        // };
        // xmlhttp.send();

        // window.ws.sendMsgIM({
        //   send_id: "1513319867128745984",
        //   session_id: "1565670092904075264",
        //   text: "评论内容",
        //   type: "审批",
        //   notice_itle: "审批标题",
        // });
      }
    },
    /**
     * item 接收消息人的id
     * val 当前用户mid
     * 发送的内容
     */
    handleIm(item, val, ressome, atUserIds) {
      const param = {
        domain_id: "0",
        type: 1,
        user_id: val,
        friend_id: item,
        institution: this.fromOrigin==="schedule"? this.scheduleInstitution : localStorage.getItem("institution")
      };
      // const content = this.$refs.jsEditorElement.textContent;
      this.$axios.post("/im/contacts", param).then((msg) => {
        let project_detail = JSON.parse(localStorage.getItem("project_detail"));
        let purchase_token = JSON.parse(localStorage.getItem("purchase_token"));
        console.log(msg);
        if (msg.code === 1000) {
          const message = {
            at_user_id: atUserIds,
            notice_title: this.task.title, // 当前审批的标题
            type: "任务评论", // 审批就传审批其他流程就传其他的
            text: ressome,
            send_id: val,
            session_id: msg.data.id, //接口返回的session_id     institution_name: localStorage.getItem("institutionName"),
            project_name: project_detail ? project_detail.project_name : "",
            institution_logo: purchase_token
              ? purchase_token.company_avatar
              : "",

            project_id: localStorage.getItem("projectId"),
            institution_id: localStorage.getItem("institution"),
            approve_id: this.activeTaskItemDetailID, // 当前通知的id

            task_id: this.activeTaskItemID,
            task_detail_id: this.activeTaskItemDetailID,
            tabKey: 'all'
          };
          console.log(message);

          window.ws.sendMsgIM(message);
        } else {
          this.$message.warning(msg.msg);
        }
      });
    },
    handleClick(e, link) {
      console.log(e, link);
    },

    // 发送评论成功后调用
    setInitComment() {
      this.pageComment.page = 1;
      // this.taskComments = [];
      this.imgList = [];
      this.fileList = [];
      this.getTaskComment(this.activeTaskItemDetailID);
    },
    setInitCommentList() {
      this.pageComment.page = 1;
      // this.taskComments = [];
      this.getTaskComment(this.activeTaskItemDetailID);
    },
    // setTimeout(()=> {
    //   this.setInitComment()
    // }, 2000)

    delFileHandle(index) {
      this.imgList.splice(index, 1);
    },
    delImgHandle(index) {
      this.imgList.splice(index, 1);
    },
    preViewImage(val, list) {
      this.src = val.file_name;
      console.log(list);
      this.showImgList = list;
      setTimeout(() => {
        this.$refs.imageView.open(this.src);
      });
    },
    preView(val) {
      this.src = val.file_name;
      // console.log(list)
      // this.showImgList = list
      setTimeout(() => {
        this.$refs.imageSingleView.open();
      });
    },
    uploadImage({ file }) {
      console.log(file);
      const formData = new FormData();
      const that = this;

      formData.append("file", file);
      formData.append("type", 20);
      formData.append("name", "file");
      formData.append("fileName", file.name);
      that.$axios
        .post(uploadUrl, formData, {
          timeout: 0,
        })
        .then((res) => {
          if (res.code === 0) {
            this.imgList.push(res.data);
            // if(this.fromType === 'detail') {
            //   console.log('type:detail')
            //   this.$emit('sendUpdateImage',  this.imgList)
            // }
            // // that.$refs.field.onFieldBlur();
            // console.log(that.$attrs);
          } else {
            that.$message.error(res.msg);
          }
        });
    },
    beforeUploadImage(file, upList) {
      const isLt30M = file.size / 1024 / 1024 < 100;
      if (!isLt30M) {
        this.$message.error("文件大小不可超過100M");
        return false;
      }
      if (this.imgList.length + upList.length > 12) {
        this.$message.error("最多可上傳12張圖片");
        return false;
      }
      const isJpgOrPng =
        file.type === "image/webp" ||
        file.type === "image/gif" ||
        file.type === "image/bmp" ||
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg";
      if (!isJpgOrPng) {
        this.$message.error("请上传jpg/jpeg/png/gif/bmp/webp文件!");
      }
      return isJpgOrPng;
    },
    uploadFile({ file }) {
      console.log(file);
      const formData = new FormData();
      const that = this;

      formData.append("file", file);
      formData.append("type", 21);
      formData.append("name", "file");
      formData.append("fileName", file.name);
      that.$axios
        .post(uploadUrl, formData, {
          timeout: 0,
        })
        .then((res) => {
          if (res.code === 0) {
            that.fileList.push(res.data);
            // that.$refs.field.onFieldBlur();
            // if(that.fromType === 'detail') {
            //   that.$set('sendUpdateUpload', that.$attrs.fileList)
            // }
            // console.log(that.$attrs);
          } else {
            that.$message.error(res.msg);
          }
        });
    },
    beforeUploadFile(file, upList) {
      const isLt30M = file.size / 1024 / 1024 < 100;
      if (!isLt30M) {
        this.$message.error("文件大小不可超過100M");
        return false;
      }
      if (this.fileList.length + upList.length > 12) {
        this.$message.error("最多可上傳12個文件");
        return false;
      }
      return true;
    },
    handleChange(info) {
      console.log(info);
    },
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
      // const temp = []
      // for (const person of personArr) {
      const btn = document.createElement("img");
      // btn.dataset.id = person.id
      // btn.dataset.name = person.member_name
      // btn.type = 'url'
      // btn.textContent = ` @${person.member_name} `
      // btn.contentEditable = false
      // btn.addEventListener('click', () => {
      //     return false
      // }, false)
      btn.setAttribute("src", url);
      btn.setAttribute("class", "emo");

      btn.setAttribute("style", "width: 26px;height:26px;");
      // btn.tabindex = '-1'
      // const bSpaceNode = document.createTextNode('\u200B') // 不可见字符，为了放光标方便
      // temp.push(btn)
      // temp.push(bSpaceNode)
      // }
      return btn;
    },

    doToggleDialog() {
      const rangeInfo = this.getEditorRange();
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
    selectPerson(person) {
      const editor = this.$refs.jsEditorElement;
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
    appendAltClick() {

      // if (this.allowSelectMembers && this.allowSelectMembers.length > 0) {
      this.mockInput = false;
      const editor = this.$refs.jsEditorElement;
      if (editor) {
        editor.focus();
        this.doToggleDialog();
      }
      // 获取新的参与人alt列表
      this.getAllNewMembers()

      // this.$refs.UserSelectModalDom.onOpen();
      // }
    },
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
    async onPaste(e) {
      console.table(e.clipboardData.items)
      const result = await this.onPasteHandle(e)
      console.log(result)
    },
    onChangeJsEditor(text) {
      console.log('ddd')
      if(text) {
        this.$refs.jsEditorElement.setAttribute('aria-placeholder', '')
      } else {
        // console.log(this.$refs.jsEditorElement.getAttribute('aria-placeholder'))
        this.$refs.jsEditorElement.setAttribute('aria-placeholder', this.ariaPlaceholder)
      }
    },
    onInputText(e) {
      this.onChangeJsEditor(e.target.innerHTML)
      console.log(e.target.innerHTML)
      // 这是输入了@，那就直接弹选人浮层
      this.doToggleDialog();
      console.log(this.editorRange);
      if (e.code === "Digit2" && e.shiftKey) {
        this.mockInput = false;
        console.log("输入@");
        // if (this.allowSelectMembers && this.allowSelectMembers.length > 0) {
        //   this.$refs.UserSelectModalDom.onOpen();
        // }
        // 获取新的参与人alt列表
        this.getAllNewMembers()
        // this.$refs.UserSelectModalDom.onOpen();
        // this.$refs.memberSelect.showModal([], this.projectId)
      }
    },
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
        // btn.dataset.id = person.member_id;
        // btn.dataset.mid = person.im_user_id;
        // btn.dataset.name = person.member_name || person.name;
        // data-mid="${some.im_user_id}"
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
    listenDeltaByAlt(delta) {
      if (
        // eslint-disable-next-line no-prototype-builtins
        delta.ops.some((v) => v.hasOwnProperty("insert") && v.insert === "@")
      ) {
        console.log("检测到@");
        if (this.visibleAlt) {
          this.getSearchKey();
          return;
        }
        this.visibleAlt = true;

        let range = this.editor.getSelection(true);
        this.currentAltPosition = range.index;
        console.log(this.currentAltPosition);
        this.editor.deleteText(range.index - 1, 1);

        // range = this.editor.getSelection(true)

        // this.editor.insertText(range.index, '@', {color: '#2176ff'}, '');

        range = this.editor.getSelection(true);
        console.log(range);
        // this.editor.updateContents(new Delta()
        //   .retain(range.index)                  // Keep 'Hello '
        //   .delete(range.length)         // 'World' is deleted, 可以解决在同一个标签里面，而不是另起一行
        // );
        console.log(range.index);
        // this.editor.setSelection(range.index-1,1)
        this.editor.insertEmbed(
          range.index,
          "nodeType",
          { class: "altSpan", text: "@fff", id: 3 },
          false
        );
        //  this.editor.insertText(range.index,'<a>djdk</a>');
        // this.editor.insertText(range.index, '@Hello', 'link', 3);
        // this.editor.setSelection(range.index + 1)
      }
    },
    getSearchKey() {},
    visibleChangeAlt(isShow) {
      console.log(isShow);
      if (!isShow && this.currentAltPosition) {
        // let range = this.editor.getSelection(true);
        // this.editor.deleteText(this.currentAltPosition-1, range.index+1-this.currentAltPosition);
        // this.editor.setSelection(range.index + 1)
      }
    },
    initData() {
      // this.visibleEmoj = false;
      // this.visibleAlt = false;
      this.imgList = [];
      this.fileList = [];
      if (this.$refs.jsEditorElement) {
        this.$refs.jsEditorElement.textContent = "";
        this.onChangeJsEditor('')
      }

      this.allowSelectMembers = [];
      this.contentQ = "";
      this.editorOption = {
        placeholder: "请输入",
        modules: {
          toolbar: {
            container: [],
          },
        },
      };
      this.editor = null;

      this.userSelectModalVisible = false;
      this.userMultipSelectModalVisible = false;
      this.projectList = []; // 项目列表
      this.timeTag = 0; // 完成情况创建或编辑
      this.editText = ""; // 完成情况编辑的内容
      this.activeTab = 1;
      this.isCollected = false; // 是否收藏
      this.isDownShow = false;
      this.scrActive = 0; // 0 所有动态，1评论
      this.activeTipItem = { key: 1, text: "不提醒" }; // 提醒時間选择
      this.leadingItem = null; // 负责人对象
      this.repeatCycle = null; // 重复周期
      this.participants = []; // 参与人对象列表
      this.itemPriorityList = []; // 优先级列表
      this.tagsList = [];
      this.taskComments = [];
      this.taskCommentsCount = 0;

      this.pageComment = {
        page: 1,
        pageSize: 10,
      };

      this.formSet = {
        title_show: false, //  是否编辑状态
        title_text: "", //

        project_show: false, // 展开项目

        address_show: false, // 地点
        address_text: "",

        matter_show: false,
        matter_text: "", // 事项
      };
      this.task = null;
    },
    copyTaskHandle() {
      if (this.activeTaskItemID) {
        this.$refs.CopyTaskModalDom.onOpen({title: this.task.title});
      } else {
        this.$message.info("请先选择任务");
      }
    },
    delTaskHandle() {
      this.outsideClose();
      const that = this;
      this.$confirm({
        title: "提示",
        okText: "確定",
        cancelText: "取消",
        icon: () => (
          <a-icon
            type="exclamation-circle"
            style="color:#FAAD14"
            theme="filled"
          />
        ),
        content: () => (
          <div style="font-size:14px;color:#333333">
            删除任務後，會移動到回收站，確定要删除嗎？
          </div>
        ),
        onOk() {
          that.delTaskAxios();
        },
      });
    },

    async delTaskAxios() {
      if (this.task) {
        const res = await this.$axios.post("task/removeTask", {
          id: this.activeTaskItemDetailID,
          institution: this.fromOrigin==="schedule"? this.scheduleInstitution : localStorage.getItem("institution")
        });
        if (res.code === 0) {
          this.$message.success(res.msg);
          this.initData();
          this.$emit("sendMessage", true); // 通知更新数据
          // 把任务详情id干掉
          this.$store.commit("task/setTaskDetailID", 0);
          this.$emit("updateTaskItemID", 0);

          // 获取菜单任务个数
          this.$store.dispatch("task/getTaskMenuCount");
        } else {
          this.$message.error(res.msg);
        }
      } else {
        this.$message.error("当前未选中任务");
      }
    },

    isFocus() {
      if (document.activeElement.id == "jsEditorElement") {
        console.log("txt2获得焦点");
      } else {
        console.log("txt2未获得焦点");
      }
    },
    appendEmoji(imgSrc) {
      // this.doToggleDialog()
      // console.log(this.editorRange)
      // this.selectEmoji(imgSrc)

      const editor = this.$refs.jsEditorElement;
      if (editor) {
        this.isFocus()
        console.log(editor.focus);
        // if (editor.focus) {
        //   editor.focus();
        //   this.doToggleDialog();
        // } else {
        //   // 刚开始没有光标
        //   editor.focus();
        //   this.doToggleDialog();
        //   this.editorRange.moveStart("character", editor.value.length);
        //   this.editorRange.collapse(true);
        //   this.editorRange.select();
        // }
        // this.getSelectPos(editor)
        // editor.focus();
        // this.doToggleDialog();
        this.selectEmoji(imgSrc);
        // const dom = this.createInsterImgData(imgSrc);
        // editor.appendChild(dom);
        // editor.focus()

        // editor.focus();
        // 删掉草稿start
        console.log('onChangeJsEditor')
        this.onChangeJsEditor('emoji')
      }
      this.visibleEmoj = false;
    },
    onEditorChange(even) {
      console.log(even);
      // console.log(this.editor)
    },
    onEditorFocus(even) {
      console.log(even);
    },
    onEditorBlur(even) {
      console.log(even);
    },
    onEditorKeyDown(even) {
      console.log(even, "onEditorKeyDown");
    },

    hideEmoj() {
      this.visibleEmoj = false;
    },
    showEmoj() {
      this.visibleEmoj = true;
    },
    setEditorOption() {
      // const vm = this
      // this.editorOption = Object.assign(this.editorOption, {
      //   placeholder: '请插入内容...',
      // })
    },

    onSrcClick(val) {
      this.scrActive = val;
      // this.taskComments = [];
      this.pageComment.page = 1;
      this.getTaskComment(this.activeTaskItemDetailID);
    },
    async getAllNewMembers() {
      const res = await this.$axios.post('/task/dynamic/getMembers', {
        id: this.activeTaskItemDetailID,
        institution: this.fromOrigin==="schedule"? this.scheduleInstitution : localStorage.getItem("institution")
      })
      if(res.code === 0) {
        // 获取members
        this.allowSelectMembers = res.data
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
    },

    async saveMultipChecked(members) {
      if (members.length) {
        try {
          let creator = this.participants.find(
            (v) => v.member_id === this.task.creator
          );

          let participants = creator ? [creator].concat(members) : members;
          // eslint-disable-next-line no-unused-vars
          const result = await this.onUpdateTask({
            participants: participants.map((v) => v.member_id),
          });
          this.participants = participants;



          setTimeout(() => {
            this.setInitCommentList();
          }, 1500);
        } catch (e) {
          this.$message.error(e.message);
        }
      }
    },
    // 删除参与人
    async handleDelPart(part) {
      if (!this.isCanEdit) return;
      let participants = this.participants.filter(
        (v) => v.member_id !== part.member_id
      );
      if (participants && participants.length) {
        try {
          // eslint-disable-next-line no-unused-vars
          const result = await this.onUpdateTask({
            participants: participants.map((v) => v.member_id),
          });
          this.participants = participants;

          setTimeout(() => {
            this.setInitCommentList();
          }, 1500);
        } catch (e) {
          this.$message.error(e.message);
        }
      }
      this.isHandleChange()

    },

    isHandleChange() {
      if(this.fromOrigin === 'schedule' && this.isCanChangeDetailID()) {
        console.log('没有执行吗')
        // 把任务详情id干掉
        this.$store.commit("task/setTaskDetailID", 0);
        this.$emit("updateTaskItemID", 0);

        // 获取菜单任务个数
        this.$store.dispatch("task/getTaskMenuCount");
      }
    },
    setPriorityListHandle(list) {
      this.itemPriorityList = list;
    },
    async getTagsData() {
      const res = await this.$axios.post("task/tags/lists", {
        institution: this.fromOrigin==="schedule"? this.scheduleInstitution : localStorage.getItem("institution")
      });
      if (res.code === 0) {
        this.tagsList = res.data;
      }
    },
    async getProjectList() {
      const res = await this.$axios.post("oa/projectAddress/lists", {
        institution: this.fromOrigin==="schedule"? this.scheduleInstitution : localStorage.getItem("institution")
      })
      if (res.code === 0) {
        this.projectList = res.data.data
          ? res.data.data.filter((v) => v.project_id !== 0 && v.status !==2)
          : [];
      } else {
        this.$message.error(res.msg);
      }
    },
    loadPrevScreen() {
      if (this.taskComments.length < this.taskCommentsCount) {
        this.pageComment.page = this.pageComment.page + 1;
        this.getTaskComment(this.activeTaskItemDetailID);
      } else {
        this.$message.info("没有更多了");
      }
    },

    async getTaskComment(id) {
      // /task/dynamic/lists
      const params = {
        task_id: id,
        page: this.pageComment.page,
        page_size: this.pageComment.pageSize,
        type: this.scrActive,
        institution: this.fromOrigin==="schedule"? this.scheduleInstitution : localStorage.getItem("institution")
      };
      const res = await this.$axios.post("task/dynamic/lists", params);
      if (res.code === 0) {
        this.switchTaskComment(res.data.lists);

        res.data.lists.reverse();
        // this.taskComments
        let taskComArr =
          this.pageComment.page === 1
            ? res.data.lists
            : res.data.lists.concat(this.taskComments);
        // taskComArr.reverse()
        this.taskComments = taskComArr;
        this.taskCommentsCount = res.data.count;
      }
    },
    switchTaskComment(data) {
      data.map((v) => {
        if (v.type === 2) {
          let text = v.content.text;
          if (text) {
            let arr = text.split(" ");
            arr = arr.map((ar) => {
              if (ar.startsWith("@")) {
                return `<span class="abcdAlt" style="color: #00a870;">${ar}</span>`;
              } else {
                return ar;
              }
            });
            v.content.text = arr.join(" ");
          }
        }
      });
    },

    async getTaskDetail(id) {
      const res = await this.$axios.post("task/details",
        { 
          id,
          institution: this.fromOrigin==="schedule"? this.scheduleInstitution : localStorage.getItem("institution")
        }
      );
      if (res.code === 0) {
        this.switchData(res.data);
        this.task = res.data;

        console.log(this.leadingItem, this.userInfo)
        console.log(this.task.subtask)
      }
    },
    switchData(task) {
      if (task) {
        task.start_date = task.start_date
          ? moment(task.start_date, "YYYY-MM-DD HH:mm")
          : null;
        task.end_date = task.end_date
          ? moment(task.end_date, "YYYY-MM-DD HH:mm")
          : null;

        task.start_date_edit = task.start_date;
        task.end_date_edit = task.end_date;

        // 提醒時間

        // 重复周期
        if (task.repeat_cycle && task.repeat_cycle.type === 2) {
          task.repeat_cycle.time = [
            task.repeat_cycle.time
              .slice(0, task.repeat_cycle.time.length - 1)
              .join(","),
            task.repeat_cycle.time[task.repeat_cycle.time.length - 1],
          ];
        }
        this.repeatCycle = task.repeat_cycle;
        this.leadingItem = task.leader_info;

        // 提醒時間
        if (task.remind_id !== 6) {
          this.activeTipItem = Object.assign(
            { id: task.remind_id, remind_map: [] },
            task.remind_map[0]
          );
        } else {
          this.activeTipItem = {
            id: task.remind_id,
            remind_map: task.remind_map.map((v) => {
              v.uuid = uuidv4();
              return v;
            }),
            type: 8,
            unit: 0,
            value: 0,
            text: "",
            remind_object: null,
          };
        }
        console.log(this.activeTipItem);

        if (task.participants_info) {
          this.participants = task.participants_info;
        } else {
          this.participants = [];
        }

        // 参与人当中创建人禁止
        this.partBanIds = [task.creator];

        // 子任务
        if (task.subtask && task.subtask.length > 0) {
          task.subtask.map((v) => {
            v.leader = v.leader_info;
            v.uuid = uuidv4();
          });
        }

        // 获取members
        this.allowSelectMembers = task.members
          .filter(v=>v.member_id !== this.userInfo.member_id)
          .map((v) => {
          v.name = v.member_name || v.name;
          v.key = v.member_id;
          v.title = v.member_name || v.name;
          return v;
        });
      }
    },
    // 是否可以修改详情id
    isCanChangeDetailID() {
      let isCan = true;
      if(this.leadingItem && this.leadingItem.member_id === this.userInfo.member_id) {
        isCan = false;
        return isCan;
      }

      if((this.task.subtask.length > 0) && this.task.subtask.some(v=>v.member_id === this.userInfo.member_id)) {
        isCan = false;
        return isCan;
      }
      
      if(this.participants.length > 0 && this.participants.some(v=>v.member_id === this.userInfo.member_id) ) {
        isCan = false;
        return false;
      }

      return isCan;

    },

    activeChangeHandle(val) {
      this.activeTab = val;
    },
    async isCollectedClickHandle() {
      const res = await this.$axios.post("task/followOperation", {
        id: this.activeTaskItemDetailID,
        status: Number(!this.task.is_follow),
        institution: this.fromOrigin==="schedule"? this.scheduleInstitution : localStorage.getItem("institution")
      });
      if (res.code === 0) {
        // this.isCollected = !this.isCollected;
        if(!this.task.is_follow) {
          this.$message.success('關註成功')
        } else {
          this.$message.success('取消關註')

        }
        this.$set(this.task, "is_follow", Number(!this.task.is_follow));
        this.$emit("sendMessage", true); // 通知更新数据
      } else {
        this.$message.error(res.msg);
      }
    },
    outsideClose() {
      this.isDownShow = false;
    },

    onUpdateTask(param) {
      const params = Object.assign({ id: this.task.id, institution: this.fromOrigin==="schedule"? this.scheduleInstitution : localStorage.getItem("institution") }, param);
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, reject) => {
        const res = await this.$axios.post("task/update", params);
        if (res.code === 0) {
          resolve(res.data);
        } else {
          reject(new Error(res.msg));
        }
      });
    },
    removeStartDate() {
      if (!this.isCanEdit) return;
      this.$set(this.task, "start_date", null);
      this.listenTimeHandle("", "start");
    },
    removeEndDate() {
      if (!this.isCanEdit) return;
      this.$set(this.task, "end_date", null);
      this.listenTimeHandle("", "end");
    },

    // 由已完成变未完成状态
    finishedClickHandle() {
      if (!this.isCanEdit) return;
      const that = this;
      this.$confirm({
        title: "提示",
        okText: "確定",
        cancelText: "取消",
        icon: () => (
          <a-icon
            type="exclamation-circle"
            style="color:#FAAD14"
            theme="filled"
          />
        ),
        content: () => (
          <div style="font-size:14px;color:#333333">
            當前狀態為已完成，調整後將會清除「完成情況」，是否確定調整狀態？
          </div>
        ),
        onOk() {
          that.setUnCompleteHandle();
        },
      });
    },
    // 切换已完成状态
    finishClickHandle() {
      if (!this.isCanEdit) return;
      this.timeTag = 0;
      this.editText = "";
      setTimeout(() => {
        this.$refs.FinishModelModalDom.onOpen();
      });
      // this.$set(this.task, "complete_status", true);
    },
    // 查看完成情况
    lookFinishInfoHandle() {
      this.timeTag = 1;
      this.editText = this.task.complete_text;
      setTimeout(() => {
        this.$refs.FinishModelModalDom.onOpen();
      });
    },

    // 設置完成情况
    async setCompleteHandle(val) {
      if (val) {
        const params = {
          complete_status: 1,
          complete_text: val,
          id: this.task.id,
          institution: this.fromOrigin==="schedule"? this.scheduleInstitution : localStorage.getItem("institution")
        };
        const res = await this.$axios.post("task/completeOperation", params);
        if (res.code === 0) {
          this.$set(this.task, "complete_text", val);
          this.$set(this.task, "complete_status", 1);
          setTimeout(() => {
            this.$refs.FinishModelModalDom.onClose();
            this.$emit("sendMessage", true); // 通知更新数据
            // 更新列表
            this.$store.commit('task/setIsReloadList', true)
            
            setTimeout(() => {
              this.setInitComment();
            }, 2000);
            // 获取菜单任务个数
            this.$store.dispatch("task/getTaskMenuCount");
          });
        } else {
          this.$message.error(res.msg);
        }
      }
    },
    sendUpdateCenterData() {
      // 更新列表
      setTimeout(()=> { // 延迟请求的原因是后台列表接口异步
        if(this.fromOrigin === 'schedule') {
          this.$store.commit('schedule/setIsReloadList', true)
        } else {
          this.$store.commit('task/setIsReloadList', true)
        }
        this.$emit("sendMessage", true); // 通知更新数据
      }, 1000)
    },
    // 設置取消完成情况
    async setUnCompleteHandle(val) {
      console.log('val==', val)
      const params = {
        complete_status: 0,
        complete_text: "",
        id: this.task.id,
        institution: this.fromOrigin==="schedule"? this.scheduleInstitution : localStorage.getItem("institution")
      };
      const res = await this.$axios.post("task/completeOperation", params);
      if (res.code === 0) {
        this.$set(this.task, "complete_text", "");
        this.$set(this.task, "complete_status", 0);
        this.$emit("sendMessage", true); // 通知更新数据
        // 更新列表
        this.$store.commit('task/setIsReloadList', true)

        setTimeout(() => {
          this.setInitComment();
        }, 2000);
        // 获取菜单任务个数
        this.$store.dispatch("task/getTaskMenuCount");
      } else {
        this.$message.error(res.msg);
      }
    },
    // 設置時間
    async listenTimeHandle(val, type) {
      console.log(val);
      let param = {
        start_date: this.task.start_date
          ? this.task.start_date.format("YYYY-MM-DD HH:mm")
          : null,
      };

      if (type === "end") {
        param = {
          end_date: this.task.end_date
            ? this.task.end_date.format("YYYY-MM-DD HH:mm")
            : null,
        };
      }

      if (this.task.start_date && this.task.end_date) {
        const diff = this.task.start_date.diff(this.task.end_date, "minutes");
        if (diff > 0) {
          this.$message.error("開始時間不能大於結束時間");

          if (type === "start") {
            this.$set(this.task, "start_date", null);
          } else if (type === "end") {
            this.$set(this.task, "end_date", null);
          }
          return;
        }
      }

      try {
        //eslint-disable-next-line
        const result = await this.onUpdateTask(param);
        this.$emit("sendMessage", true); // 通知更新数据
        setTimeout(() => {
          this.setInitComment();
        }, 2000);
      } catch (e) {
        // console.log(e.message)
        this.$message.error(e.message);
      }
    },
    async listenTimeHandleOk(val, type) {
      console.log(val);
      let param = {
        start_date: this.task.start_date_edit
          ? this.task.start_date_edit.format("YYYY-MM-DD HH:mm")
          : null,
      };

      if (type === "end") {
        param = {
          end_date: this.task.end_date_edit
            ? this.task.end_date_edit.format("YYYY-MM-DD HH:mm")
            : null,
        };
      }

      if (type === "start" && this.task.end_date) {
        const diff = this.task.start_date_edit.diff(
          this.task.end_date,
          "minutes"
        );
        if (diff > 0) {
          this.$message.error("開始時間不能大於結束時間");
          return;
        }
      }

      if (type === "end" && this.task.start_date) {
        const diff = this.task.start_date.diff(
          this.task.end_date_edit,
          "minutes"
        );
        if (diff > 0) {
          this.$message.error("開始時間不能大於結束時間");
          return;
        }
      }

      // if(this.task.start_date && this.task.end_date) {
      //   const diff = this.task.start_date.diff(this.task.end_date, 'minutes')
      //   if(diff > 0) {
      //     this.$message.error('開始時間不能大於結束時間')

      //     if(type === 'start') {
      //       this.$set(this.task, 'start_date', null)
      //     } else if(type === 'end') {
      //       this.$set(this.task, 'end_date', null)
      //     }
      //     return ;
      //   }
      // }

      try {
        //eslint-disable-next-line
        const result = await this.onUpdateTask(param);

        if (type === "start") {
          this.$set(this.task, "start_date", this.task.start_date_edit);
        } else if (type === "end") {
          this.$set(this.task, "end_date", this.task.end_date_edit);
        }
        // this.$emit("sendMessage", true); // 通知更新数据
        this.sendUpdateCenterData()
        
        setTimeout(() => {
          this.setInitComment();
        }, 2000);
      } catch (e) {
        // console.log(e.message)
        this.$message.error(e.message);
      }
    },
    // 更新重复周期
    async updateRepetPeriodInfo() {
      let params = {
        repeat_cycle: null,
      };
      if (this.repeatCycle) {
        if (this.repeatCycle.type === 2) {
          const vnew = { stop_time: "", time: [], type: 2 };
          let week = this.repeatCycle.time[0].split(",");

          vnew.time = [...week, this.repeatCycle.time[1]];
          (vnew.type = this.repeatCycle.type),
            (vnew.stop_time = this.repeatCycle.stop_time);
          params.repeat_cycle = vnew;
        } else {
          params.repeat_cycle = this.repeatCycle;
        }
      }

      try {
        // eslint-disable-next-line
        const result = await this.onUpdateTask(params);
        // this.$emit("sendMessage", true); // 通知更新数据
        setTimeout(() => {
          this.setInitComment();
        }, 2000);
      } catch (e) {
        // console.log(e.message)
        this.$message.error(e.message);
      }
    },
    sendReloadData() {
      this.sendReloadComment()
      this.isHandleChange()
    },
    sendReloadComment() {
      this.$emit("sendMessage", true); // 通知更新数据
      setTimeout(() => {
        this.setInitComment();
      }, 2000);
    },
    // 切换事项
    exchangeEditMatter() {
      if (!this.isCanEdit) {
        return;
      }
      this.$set(this.formSet, "matter_text", this.task.matter);
      this.$set(this.formSet, "matter_show", !this.formSet.matter_show);
    },

    // 取消编辑事项
    onCancelMatter() {
      this.$set(this.formSet, "matter_text", "");
      this.$set(this.formSet, "matter_show", false);
    },
    // 保存编辑地址
    async onSaveMatter() {
      let param = {
        matter: this.formSet.matter_text,
      };
      try {
        // eslint-disable-next-line
        const result = await this.onUpdateTask(param);
        this.$set(this.task, "matter", this.formSet.matter_text);
        this.$set(this.formSet, "matter_show", false);
        // 事项不需要更新数据
        // this.$emit("sendMessage", true); // 通知更新数据

        setTimeout(() => {
          this.setInitCommentList();
        }, 1500);
      } catch (e) {
        this.$message.error(e.message);
      }
    },

    // 切换地址
    exchangeEditAddress() {
      if (!this.isCanEdit) return;
      this.$set(this.formSet, "address_text", this.task.place);
      this.$set(this.formSet, "address_show", !this.formSet.address_show);
    },
    // 取消编辑地址
    onCancelAddress() {
      this.$set(this.formSet, "address_text", "");
      this.$set(this.formSet, "address_show", false);
    },
    // 保存编辑地址
    async onSaveAddress() {
      let param = {
        place: this.formSet.address_text,
      };
      try {
        // eslint-disable-next-line
        const result = await this.onUpdateTask(param);
        this.$set(this.task, "place", this.formSet.address_text);
        this.$set(this.formSet, "address_show", false);
        // 地址不需要更新数据
        // this.$emit("sendMessage", true); // 通知更新数据
        setTimeout(() => {
          this.setInitCommentList();
        }, 1500);
      } catch (e) {
        this.$message.error(e.message);
      }
    },

    // 切换主题编辑
    exchangeEditTitle() {
      if (!this.isCanEdit) {
        return;
      }
      this.$set(this.formSet, "title_text", this.task.title);
      this.$set(this.formSet, "title_show", !this.formSet.title_show);
    },

    // 取消编辑主题
    onCancelTitle() {
      this.$set(this.formSet, "title_text", "");
      this.$set(this.formSet, "title_show", false);
    },
    // 保存编辑主题标题
    async onSaveTitle() {
      if(!this.formSet.title_text) return;
      let param = {
        title: this.formSet.title_text,
      };
      try {
        // eslint-disable-next-line
        const result = await this.onUpdateTask(param);
        this.$set(this.task, "title", this.formSet.title_text);
        this.$set(this.formSet, "title_show", false);

        this.$emit("sendMessage", true); // 通知更新数据
        setTimeout(() => {
          this.setInitComment();
        }, 2000);
      } catch (e) {
        this.$message.error(e.message);
      }
    },
    getNameContent(name) {
      if (!name) {
        return "--";
      }
      const namestr = name.replace(
        /[`~_!@#$^&*()=|{}':;',?~！@#￥……&*（）——|{}【】'；：""'。，、？\s]/g,
        ""
      );
      const isletter = /^[a-zA-Z]+$/.test(namestr);
      if (isletter) {
        return name.slice(0, 2);
      } else {
        return name.slice(name.length - 2, name.length);
      }
    },
    /**
     * 人员选择完成
     */
    async saveChecked(members) {
      console.log(members);
      // this.members = members
      if (members.length) {
        try {
          // eslint-disable-next-line
          const result = await this.onUpdateTask({
            leader: members[0].member_id,
          });
          this.$emit("sendMessage", true); // 通知更新数据
          this.leadingItem = members[0];
          setTimeout(() => {
            this.setInitCommentList();
          }, 1500);
        } catch (e) {
          // console.log(e.message)
          this.$message.error(e.message);
        }
        console.log(this.leadingItem);
      }
    },
    async handleDelLeading() {
      if (!this.isCanEdit) return;
      try {
        // eslint-disable-next-line
        const result = await this.onUpdateTask({ leader: 0 });
        this.$emit("sendMessage", true); // 通知更新数据
        this.leadingItem = null;

        this.isHandleChange()

        setTimeout(() => {
          this.setInitComment();
        }, 2000);
      } catch (e) {
        // console.log(e.message)
        this.$message.error(e.message);
      }
    },
    handleAddLeading() {
      if (!this.isCanEdit) return;
      let arr = [];
      if (this.leadingItem) {
        arr = [this.leadingItem.member_id];
      }
      this.$refs.memberSelect.showModal(arr, 0);
    },

    setRepetPeriod() {
      if (!this.isCanEdit || !this.task.cycle_update) return;
      /**
       * 在点击設置按钮时需要校验“开始日期和结束日期”是否設置，
       * 只有全都設置才可以点击“設置”。如果又其中任意一个時間没有設置会弹出提示：
       * 重复周期需設置开始日期和结束日期
       */
      // 設置重复周期
      if (this.task.start_date && this.task.end_date) {
        this.$refs.RepetPeriodModalDom.onOpen();
      } else {
        this.$message.warning("重复周期需設置开始日期和结束日期");
      }
    },
    async delProject() {
      let param = {
        project_id: 0,
      };
      try {
        // eslint-disable-next-line
        const result = await this.onUpdateTask(param);
        this.$set(this.task, "project_id", 0);

        this.$emit("sendMessage", true); // 通知更新数据
        setTimeout(() => {
          this.setInitCommentList();
        }, 1500);
      } catch (e) {
        this.$message.error(e.message);
      }
    },
    // 更新优先级
    async updatePriorityHandle(id) {
      let param = {
        priority: id,
      };
      try {
        // eslint-disable-next-line
        const result = await this.onUpdateTask(param);
        this.$set(this.task, "priority", id);

        this.$emit("sendMessage", true); // 通知更新数据
        setTimeout(() => {
          this.setInitCommentList();
        }, 1500);
      } catch (e) {
        this.$message.error(e.message);
      }
    },
    // 更新任务图片
    async sendUpdateImage(images) {
      let param = {
        images,
      };
      try {
        // eslint-disable-next-line
        const result = await this.onUpdateTask(param);
        // this.$set(this.task, "priority", id);

        // this.$emit("sendMessage", true); // 通知更新数据
        setTimeout(() => {
          this.setInitCommentList();
        }, 1500);
      } catch (e) {
        this.$message.error(e.message);
      }
    },
    // 更新任务文件
    async sendUpdateUpload() {
      let param = {
        attachment: this.task.attachment,
      };
      try {
        // eslint-disable-next-line
        const result = await this.onUpdateTask(param);
        // this.$set(this.task, "priority", id);

        // this.$emit("sendMessage", true); // 通知更新数据
        setTimeout(() => {
          this.setInitCommentList();
        }, 1500);
      } catch (e) {
        this.$message.error(e.message);
      }
    },
    // 更新提醒時間
    async sendTipTime(obj) {
      let param = {
        remind_id: obj.id,
        remind_map: obj.remind_map,
      };
      try {
        // eslint-disable-next-line
        const result = await this.onUpdateTask(param);
        this.activeTipItem = obj;
        // this.$set(this.task, "priority", id);

        // this.$emit("sendMessage", true); // 通知更新数据

        setTimeout(() => {
          this.setInitComment();
        }, 2000);
      } catch (e) {
        this.$message.error(e.message);
      }
    },

    // 更新标签
    async sendTagsUpdate(tags) {
      let param = {
        tags,
      };
      try {
        // eslint-disable-next-line
        const result = await this.onUpdateTask(param);
        this.$set(this.task, "tags", tags);

        setTimeout(() => {
          this.setInitCommentList();
        }, 1500);
      } catch (e) {
        this.$message.error(e.message);
      }
    },
    // 更新项目
    async listenProjectSelect(project_id) {
      console.log(project_id);
      // return
      let param = {
        project_id,
      };
      try {
        // eslint-disable-next-line
        const result = await this.onUpdateTask(param);
        // this.$set(this.task, "tags", tags);
        setTimeout(() => {
          this.setInitCommentList();
        }, 1500);
      } catch (e) {
        this.$message.error(e.message);
      }
    },
    handleAddParticipants() {
      if (!this.isCanEdit) return;

      this.$refs.memberMultipSelect.showModal(
        this.participants.filter((v) => v.member_id !== this.task.creator),
        0
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.noEdit {
  cursor: not-allowed !important;
}
.emptyShow {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 100px;
  height: calc(100vh - 202px);
  .image {
    width: 220px;
    height: 160px;
  }
  .tips {
    font-size: 14px;
    font-family: MicrosoftYaHei, MicrosoftYaHei-MicrosoftYaHei;
    font-weight: normal;
    text-align: left;
    color: #333333;
    line-height: 22px;
    margin-top: 10px;
    margin-bottom: 40px;
  }
}
#jsEditorElement {
  max-height: 60px;
  overflow-y: auto;
  margin: 0 20px;
}
.files {
  &-list {
    display: flex;
    flex-direction: column;
    margin-top: 18px;
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px 6px;
      padding-right: 8px;
      background: #f5f8ff;
      border-radius: 4px;
      margin-bottom: 10px;
      cursor: pointer;
      user-select: none;

      &-left {
        display: flex;
        align-items: center;
        flex: auto;

        .icon {
          display: flex;
          align-items: center;
          margin-right: 6px;
        }
      }
      &-right {
        flex: inherit;
      }
    }
  }
}
.downIcon {
  color: #aaa;
}
.delIcon {
  color: #aaa;
}
.fileDetail {
  // margin-top: 16px;
  // width: 100%;
  max-height: 130px;
  overflow-y: auto;
  margin: 10px 20px;
  .itemDetail {
    background: #e8f1ff;
    border-radius: 8px;
    display: flex;
    align-items: center;
    padding: 4px 6px;
    padding-right: 8px;
    // border-radius: 4px;
    // width: 100%;
    margin-bottom: 10px;
    cursor: pointer;
    user-select: none;
    justify-content: flex-start;

    .icon {
    }
    .name {
      flex: 1;
      // width: 200px;
      margin-left: 7px;
    }
    :hover {
      color: #2176ff;
      .downIcon {
        color: #2176ff;
      }
      .delIcon {
        color: #2176ff;
      }
    }
  }
}

.images {
  &-list {
    display: flex;
    flex-wrap: wrap;
    margin: 0 20px;
    max-height: 100px;
    overflow-y: auto;
    transition: all 0.2s;

    .item {
      position: relative;
      margin-right: 14px;
      margin-top: 16px;
      img {
        width: 80px;
        height: 80px;
        border: 1px solid #e5e5e5;
        cursor: pointer;
        user-select: none;
      }
      .x {
        // width: 18px;
        // height: 18px;
        position: absolute;
        // background: rgba(34, 34, 34, 0.5);
        // border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        right: -13px;
        top: -8px;
        line-height: 14px;

        cursor: pointer;
        user-select: none;
        &-icon {
          color: rgba(34, 34, 34, 0.5);
          font-size: 22px !important;
        }
      }
    }
  }
}
.detail {
  // border: 1px solid red;
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
    box-shadow: 0 -4px 12px -3px rgba(0, 0, 0, 0.06);
    // box-shadow: 0px 2px 18px 0px rgba(0,0,0,0.20);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    &-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 28px;
      padding: 0 20px;
      .operate {
        display: flex;
        align-items: center;
        .op {
          margin-right: 15px;
          cursor: pointer;
          user-select: none;
        }
        ::v-deep.ant-upload {
          // line-height: 27px;
        }
      }
    }
    &-body {
      transition: all 0.2s;
    }
  }
  &-banner {
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    ::v-deep .ant-tabs-nav .ant-tabs-tab {
      // padding: 10px 0px;
      margin-left: 20px;
      // margin-right: 20px;
      margin-right: 0;
      color: #666666;
    }
    ::v-deep.ant-tabs-nav .ant-tabs-tab-active {
      color: #2176ff;
      font-weight: 700;
    }
    ::v-deep.ant-tabs-bar {
      margin-bottom: 0;
    }

    .toLeft {
      display: flex;
      align-items: center;
      &-tab {
        margin-left: 20px;
        font-size: 14px;
        font-family: MicrosoftYaHei, MicrosoftYaHei-Regular;
        font-weight: 400;
        color: #666666;
        cursor: pointer;
      }
      &-active {
        font-weight: 700;
        color: #2176ff;
      }
    }
    .toRight {
      margin-right: 20px;
      display: flex;
    }
  }

  &-body {
    padding: 0 20px;
    height: calc(100vh - 280px);
    overflow-y: auto;

    &-form {
    }
  }

  .comment {
    border-top: 1px solid #e5e5e5;
    padding-bottom: 120px;
    &-screen {
      margin-top: 15px;
      .scr {
        font-size: 14px;
        font-family: MicrosoftYaHei, MicrosoftYaHei-MicrosoftYaHei;
        font-weight: normal;
        color: #333333;
        line-height: 19px;
        padding: 6px 34px;
        background: #f7f7f7;
        border-radius: 4px;
        cursor: pointer;
        user-select: none;
        margin-right: 10px;
      }
      .scrActive {
        background: #ecf2ff;
        color: #2176ff;
      }
    }

    &-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 15px;
      .load {
        padding: 6px 20px;
        font-size: 14px;
        font-family: MicrosoftYaHei, MicrosoftYaHei-MicrosoftYaHei;
        font-weight: normal;
        color: #2176ff;
        transition: background-color 0.2s linear;
        cursor: pointer;
        user-select: none;
        &:hover {
          background: #ecf2ff;
        }
      }
    }
    &-list {
      .trends {
        display: flex;
        margin-bottom: 15px;
        &:first-child {
          margin-top: 15px;
        }
        .icon {
          padding: 0 10px;
          i {
            color: #aaaaaa;
          }
          img {
            width: 36px;
            height: 36px;
          }
        }
        .desc {
          display: flex;
          flex-direction: column;
          flex: 1;
          &-it {
            word-wrap: break-word;
            font-size: 14px;
            font-family: MicrosoftYaHei, MicrosoftYaHei-MicrosoftYaHei;
            color: #999999;
            line-height: 22px;
            max-width: 516px;
          }
        }
        .time {
          font-size: 14px;
          font-family: MicrosoftYaHei, MicrosoftYaHei-MicrosoftYaHei;
          font-weight: normal;
          color: #999999;
          line-height: 22px;
        }
      }
    }
  }
}
.formEditItem {
  align-items: flex-start !important;
}
.formItem {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  min-height: 32px;
  &-images {
    flex: 1;
    // width: 200px;
    // line-height: 22px;
  }
  &-part {
    font-size: 14px;
    font-family: MicrosoftYaHei, MicrosoftYaHei-MicrosoftYaHei;
    font-weight: normal;
    color: #333333;
    line-height: 22px;
  }

  &-textarea {
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    .operate {
      display: flex;
      justify-content: flex-end;
      margin-top: 10px;
    }
  }

  &-label {
    width: 97px;
    font-size: 14px;
    font-family: MicrosoftYaHei, MicrosoftYaHei-Regular;
    font-weight: 400;
    color: #999999;
    line-height: 22px;

    .iconfont {
      margin-right: 10px;
    }
  }

  &-text {
    font-size: 16px;
    font-family: MicrosoftYaHei, MicrosoftYaHei-Bold;
    font-weight: 700;
    color: #333333;
    line-height: 24px;
    transition: all 0.15s linear;
    padding: 0 5px;
    max-width: 480px;

    &:hover {
      background: #e8f0ff;
      border-radius: 4px;
    }
  }
  &-textTwo {
    font-size: 14px;
    font-family: MicrosoftYaHei, MicrosoftYaHei-MicrosoftYaHei;
    font-weight: normal;
    color: #333333;
    line-height: 22px;
    max-width: 480px;
    word-break: break-word;
    transition: all 0.15s linear;
    padding: 0 5px;

    &:hover {
      background: #e8f0ff;
      border-radius: 4px;
    }
  }
  &-unbtnFinish {
    // margin-left: 5px;
    padding: 5px 10px;
    background: #f5f5f5;
    border-radius: 4px;
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;

    &-select {
      width: 16px;
      height: 16px;
      border: 1px solid #aaaaaa;
      border-radius: 2px;
      margin-right: 10px;
      cursor: pointer;
    }
    &-val {
      font-size: 14px;
      font-family: MicrosoftYaHei, MicrosoftYaHei-Regular;
      font-weight: 400;
      color: #333333;
    }
  }
  &-btnFinish {
    cursor: pointer;
    user-select: none;
    // margin-left: 5px;
    padding: 5px 10px;
    background: #d9f2ea;
    border-radius: 4px;
    display: flex;
    align-items: center;
    .iconfont {
      margin-right: 10px;
      color: #4caf50;
    }
    &-val {
      font-size: 14px;
      font-family: MicrosoftYaHei, MicrosoftYaHei-Regular;
      font-weight: 400;
      color: #00ac6b;
    }
  }

  &-time {
    display: flex;
    align-items: center;

    &-left {
      padding: 0 5px;
      position: relative;
      color: #333333;
      border-radius: 4px;
      transition: background-color 0.15s linear;
      .date {
        min-width: 140px !important;
        position: absolute;
        left: 0;
        top: -5px;
        opacity: 0;
      }

      .toLeftX {
        display: none;
      }
      &:hover {
        background: #e8f0ff;
        color: #2176ff;
        .toLeftX {
          display: block;

          // width: 15px;
          // height: 15px;
          color: rgba(34, 34, 34, 0.5);
          // border-radius: 50%;
          position: absolute;
          top: -10px;
          right: -10px;
          z-index: 3;
          cursor: pointer;
          // transition: visible  0.5 linear ;
        }
      }
    }
    &-right {
      padding: 0 5px;
      position: relative;
      color: #333333;
      border-radius: 4px;
      transition: background-color 0.15s linear;
      .date {
        min-width: 140px !important;
        position: absolute;
        left: 0;
        top: -5px;
        opacity: 0;
      }
      .toRightX {
        display: none;
      }
      &:hover {
        background: #e8f0ff;
        color: #2176ff;
        cursor: pointer;
        .toRightX {
          display: block;

          // width: 15px;
          // height: 15px;
          color: rgba(34, 34, 34, 0.5);
          // border-radius: 50%;
          position: absolute;
          top: -10px;
          right: -10px;
          z-index: 3;
          // transition: visible  0.5 linear ;
        }
      }
    }
  }
  &-value {
    display: flex;
    flex: 1;
    position: relative;
    .setProjectText {
      // flex: 1;
      max-width: 478px;
      padding: 0 5px;
      position: relative;
      color: #333333;
      border-radius: 4px;
      transition: background-color 0.15s linear;
      .toX {
        display: none;
        color: rgba(34, 34, 34, 0.5);
        position: absolute;
        top: -10px;
        right: -10px;
        cursor: pointer;
        z-index: 2;
      }
    }
    .setProjectSelect {
      position: absolute;
      max-width: 100%;
      min-width: 30%;

      opacity: 0;
      z-index: 1;
    }

    &:hover {
      .setProjectText {
        background: #e8f0ff;
        color: #2176ff;
        .toX {
          display: block;

          // width: 15px;
          // height: 15px;
          color: rgba(34, 34, 34, 0.5);
          // border-radius: 50%;
          position: absolute;
          top: -10px;
          right: -10px;
          cursor: pointer;
          // transition: visible  0.5 linear ;
        }
      }
    }
  }
}

.collect {
  width: 24px;
  height: 24px;
  text-align: center;
  line-height: 24px;
  cursor: pointer;

  margin-right: 15px;

  border-radius: 4px;
  transition: background-color 0.15s linear;
  &:hover {
    background: #e8f0ff;
    .iconfont {
      color: #2176ff;
    }
  }
}
.edit {
  width: 24px;
  height: 24px;
  cursor: pointer;

  text-align: center;
  line-height: 24px;
  // margin: auto;
  border-radius: 4px;
  transition: background-color 0.15s linear;

  position: relative;
  .down {
    position: absolute;
    right: 0;
    margin-top: 6px;
    z-index: 1;
    background: #ffffff;

    display: flex;
    flex-direction: column;
    min-width: 97px;
    border-radius: 4px;
    box-shadow: 0px 2px 18px 0px rgba(0, 0, 0, 0.2);
    &-item {
      padding: 10px;
      font-size: 14px;
      font-family: MicrosoftYaHei, MicrosoftYaHei-Regular;
      font-weight: 400;
      color: #333333;
      line-height: 22px;
      transition: background-color 0.15s linear;

      .iconfont {
        margin-right: 5px;
        color: #aaaaaa;
      }
      &:hover {
        color: #2176ff;
        background: #e8f0ff;
        .iconfont {
          color: #2176ff;
        }
      }
    }
  }

  &:hover {
    background: #e8f0ff;
    .iconfontOne {
      color: #2176ff;
    }
  }
}

.cancel {
  padding: 5px 15px;
  border: 1px solid #c6c6c6;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s linear;
  &:hover {
    background: #f6f6f6;
  }
}
.sure {
  padding: 5px 15px;
  background: #2176ff;
  color: #ffffff;
  margin-left: 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s linear;
}
.disable_sure {
  opacity: 0.5;
  cursor: not-allowed;
}

// .leading {
//   display: flex;
//   align-items: center;
//   // line-height: 28px !important;
//   flex-wrap: wrap;
//   // height: 40px;
//   &-add {
//     font-size: 14px;
//     font-family: MicrosoftYaHei, MicrosoftYaHei-Regular;
//     font-weight: 400;
//     color: #2176ff;
//     cursor: pointer;
//     user-select: none;
//   }
//   &-addTwo {
//     font-size: 14px;
//     font-family: MicrosoftYaHei, MicrosoftYaHei-Regular;
//     font-weight: 400;
//     // color: #2176ff;
//     cursor: pointer;
//     user-select: none;
//     padding: 6px 22px !important;
//     margin-bottom: 10px;
//   }
//   &-item {
//     display: flex;
//     align-items: center;
//     background: rgba(33, 118, 255, 0.1);
//     border-radius: 16px;
//     padding: 2px 12px;
//     padding-right: 8px;
//     user-select: none;

//     img {
//       width: 28px;
//       height: 28px;
//       border: 1px solid #e5e5e5;
//       border-radius: 4px;
//       margin-right: 4px;
//     }
//     .iconfont {
//       margin-left: 5px;
//       color: #2176ff;
//       cursor: pointer;
//     }
//     .box {
//       width: 28px;
//       height: 28px;
//       background: #0389ff;
//       border-radius: 4px;
//       color: #ffffff;
//       text-align: center;
//       line-height: 28px;
//       font-size: 12px;
//       margin-right: 4px;
//     }
//   }
//   .partcss {
//     margin-right: 10px;
//     margin-bottom: 10px;
//     line-height: 18px;
//   }
// }

.repet {
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  font-family: MicrosoftYaHei, MicrosoftYaHei-Regular;
  font-weight: 400;
  color: #2176ff;
  cursor: pointer;
  user-select: none;
}
.baseInputWidth {
  // min-width: 100% !important;
  // width: 300px;
}

.leading {
  display: flex;
  align-items: center;
  // line-height: 28px !important;
  flex-wrap: wrap;
  max-height: 160px;
  overflow-y: auto;
  // height: 40px;
  &-add {
    font-size: 14px;
    font-family: MicrosoftYaHei, MicrosoftYaHei-Regular;
    font-weight: 400;
    color: #2176ff;
    cursor: pointer;
    user-select: none;
  }
  &-addTwo {
    font-size: 14px;
    font-family: MicrosoftYaHei, MicrosoftYaHei-Regular;
    font-weight: 400;
    // color: #2176ff;
    cursor: pointer;
    user-select: none;
    padding: 6px 22px !important;
    margin-bottom: 10px;
  }
  &-item {
    display: flex;
    align-items: center;
    background: rgba(33, 118, 255, 0.1);
    border-radius: 16px;
    padding: 2px 12px;
    padding-right: 8px;
    user-select: none;
    .hanDel {
      display: none;
    }
    &:hover {
      .hanDel {
        display: inline-block;
      }
    }

    img {
      width: 28px;
      height: 28px;
      border: 1px solid #e5e5e5;
      border-radius: 4px;
      margin-right: 4px;
    }
    .iconfont {
      margin-left: 5px;
      color: #2176ff;
      cursor: pointer;
    }
    .box {
      width: 28px;
      height: 28px;
      background: #0389ff;
      border-radius: 4px;
      color: #ffffff;
      text-align: center;
      line-height: 28px;
      font-size: 12px;
      margin-right: 4px;
    }
  }
  .partcss {
    margin-right: 10px;
    margin-bottom: 10px;
    line-height: 18px;
  }
}

.addBtns {
  padding: 8px 22px;
  border: 1px solid #c6c6c6;
  border-radius: 17px;
  line-height: 18px;
  position: relative;
  cursor: pointer;
  user-select: none;
  margin-right: 15px;

  .addIcon {
    line-height: 14px !important;
    height: 14px;
  }
  transition: all 0.25s linear;
  &:hover {
    padding: 8px 22px;
    border: 1px solid #2176ff;
    .addIcon {
      color: #2176ff;
    }
  }
}
::v-deep.ql-editor {
  min-height: auto;
  img {
    width: 20px !important;
    height: 20px !important;
  }
}

::v-deep.ql-toolbar.ql-snow {
  display: none;
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
.alt-panel {
  display: flex;
  flex-direction: column;
  &-item {
    border-radius: 0;
    padding: 5px 12px;
    background: #ffffff;
    transition: background-color 0.2s linear;
    cursor: pointer;
    user-select: none;
    &:hover {
      background: rgba(33, 118, 255, 0.1);
    }

    img {
      width: 22px;
      height: 22px;
    }
    .box {
      width: 22px;
      height: 22px;
      line-height: 22px;
    }
  }
}
::v-deep.altSpan {
  cursor: pointer;
  user-select: none;
  color: #2176ff;
}

.textareamock {
  // border: 1px solid #e1e1e1;

  min-height: 60px;
  width: 100%;
  border-radius: 4px;
  padding: 10px 10px;
}
// .textareamock:empty:before {
//   content: "@參與人將通過聊天發給對方";
//   // white-space: pre;
//   color: #cccaca;
// }

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

.boxss {
  width: 28px;
  height: 28px;
  background: #0389ff;
  border-radius: 4px;
  color: #ffffff;
  text-align: center;
  line-height: 28px;
  font-size: 12px;
  margin-right: 4px;
}

.setIcon {
  width: 52px;
  text-align: center;
}
.descImage {
  margin: 0;
  overflow-y: none;
  max-height: none;
  justify-content: flex-start;
  &-item {
    margin-right: 9px !important;

    &:nth-child(6n) {
      margin-right: 0 !important;
    }
  }
  img {
    width: 80px !important;
    height: 80px !important;
  }
}
.descComment {
  background: #e8f1ff;
  border-radius: 8px;
  margin-top: 10px;
  padding: 8px 15px;

  font-size: 14px;
  font-family: MicrosoftYaHei, MicrosoftYaHei-MicrosoftYaHei;
  font-weight: normal;
  color: #242933 !important;
  width: 516px;
  .abcdAlt {
    font-size: 14px;
    font-family: MicrosoftYaHei, MicrosoftYaHei-MicrosoftYaHei;
    font-weight: normal;
    color: #00a870;
    display: inline-block;
  }
}
.desTop {
  display: flex;
  justify-content: space-between;
  &-name {
    font-size: 14px;
    font-family: MicrosoftYaHei, MicrosoftYaHei-MicrosoftYaHei;
    font-weight: normal;
    color: #999999;
    max-width: 400px;
    .cancelSet {
      font-size: 14px;
      font-family: MicrosoftYaHei, MicrosoftYaHei-MicrosoftYaHei;
      font-weight: normal;
      color: #2176ff;
      margin-left: 5px;
      cursor: pointer;
      user-select: none;
    }
  }
  &-time {
    font-size: 14px;
    font-family: MicrosoftYaHei, MicrosoftYaHei-MicrosoftYaHei;
    font-weight: normal;
    color: #999999;
  }
}

.files {
  display: flex;
  flex-direction: column;
  margin-top: 5px;
  &-item {
    display: flex;
    align-items: center;
    .name {
      flex: 1;
      font-size: 14px;
      font-family: MicrosoftYaHei, MicrosoftYaHei-MicrosoftYaHei;
      font-weight: normal;
      color: #2176ff;
      user-select: none;
      cursor: pointer;
    }
  }
}

pre {
  white-space: pre-wrap; /*css-3*/
  word-wrap: break-word; /*InternetExplorer5.5+*/
  padding: 0;
  // margin-top: 15px;
}

.an-box {
  padding: 0 20px;
}
::v-deep .ant-anchor-ink {
  position: relative;
}
::v-deep.ant-anchor {
  display: flex;
  padding-left: 0;
}
.ant-anchor-link {
  padding: 0;
  // display: flex;
  // border: 1px solid #e1e1e1;
  // width: 125px;
  margin-right: 20px;
  .ant-anchor-link-title {
    font-size: 14px;
    font-family: MicrosoftYaHei, MicrosoftYaHei-MicrosoftYaHei;
    font-weight: normal;
    color: #666666;
  }
}
.ant-anchor-link-active {
  font-size: 14px;
  font-family: MicrosoftYaHei, MicrosoftYaHei-Bold;
  font-weight: 700;
  color: #2176ff;
}

.addText {
  display: inline-block;
  // max-width: 400px;
}

.downIcon {
  color: #2176FF;
  cursor: pointer;
}
</style>
