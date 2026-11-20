
import { getAdList } from '@/api/user.js'
export const myMIxins = {
    data(){
        return {
            ballBanner: '',
            adCode:''
        }
    },
    created() {
        this.getAdList()
    },
    methods: {
        getAdList (){
            getAdList().then((res) => {
              if (res && res.data) {
                let objs = res.data.find(ele => ele.ad_id === this.adCode) || null
                this.ballBanner = objs ? objs.img_address : '/static/images/main-banner.jpg'
              }
            })
          }
    }
}