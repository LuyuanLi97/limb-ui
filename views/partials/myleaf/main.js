// 创建新的思维导图
($(function() {
    var inputData = {};

    $.get('./test.json').done(function(json, status, xhr) {
        // 初始化第一个节点
        inputData = JSON.parse(json);
        while (inputData[0].name === "") {
            inputData[0].name = prompt("请为您的第一个节点设置一个名字：");
        }
        var valueCount = 0;
        inputData[0].value = valueCount;
        valueCount++;
        var myCharts = echarts.init($("#main").get(0));
        option = {
            title: {
                text: "Limb",
                subtext: "Made By konigsberg",
            },
            legend: {
                // 和series里面的name对应
                data: [inputData[0].name.toString()],
            },
            // 工具箱
            toolbox: {
                show: true,
                feature: {
                    mark: {show: true},
                    dataZoom: {show: true},
                    dataView: {show: true},
                    restore: {show: true},
                    saveAsImage: {show: true},
                }
            },
            calculable : false,
            tooltip: {
                // 节点可以进入
                show: true,
                formatter: '{b}:{c}',
            },
            series: [
                {
                    name: inputData[0].name,
                    type:'tree',
                    // 树的展示方式
                    orient: 'horizontal',
                    rootLocation: {
                        x: 100,
                        y: 'center',
                    },
                    nodePadding: 25,
                    itemStyle: {
                        normal: {
                            // 不支持显示value
                            label: {
                                show: true,
                                position: 'bottom',
                            },
                            color: 'rgb(44, 153, 132)',
                            lineStyle: {
                                color: 'rgb(50, 74, 94)',
                                width: 3,
                                type: 'curve',
                            },
                        }
                    },
                    // 可以点击
                    clickable: true,
                    // roam: true,
                    // 是否反转
                    // direction: 'inverse',
                    data: inputData
                }
            ],
        };

        myCharts.setOption(option);
        var myCopyContent = {};
        // myCharts.on("click", clickOnce);
        myCharts.on("dblclick", function(ecData) {
            console.log(ecData);
            // $('#dropdown').trigger('click');
            $('.dropdown-toggle').dropdown('toggle');
            // 创建新节点
            // var createFlag = false;
            $('#create [type="submit"]').on('click', function(event) {
                // if (!createFlag)
                console.log(ecData.name);

                var newNodeName = $('#create [type="text"]').val();
                var thisValue = ecData.data.value;
                var current = findCurrentNodeByValue(thisValue);
                var currentChildren = current.children;

                var newObj = {
                    name: newNodeName,
                    value: valueCount,
                    children: []
                };
                valueCount++;
                current.children.push(newObj);
                myCharts.clear();
                myCharts.setOption(option);
                myCharts.refresh();
            });

            // 删除节点
            $('#delete [type="submit"]').on('click', function(event) {
                console.log(ecData.name);
                // var nodeName = ecData.name;
                var thisValue = ecData.data.value;
                var parent = findParentNodeByValue(thisValue);
                // console.log(parent);
                // 防止删两次
                if (!$.isEmptyObject(parent)) {
                    console.log(parent);
                    function willBeDelete(child) {
                        return child.value != thisValue;
                    }
                    var newChlidren = parent.children.filter(willBeDelete);
                    parent.children = newChlidren;
                    myCharts.clear();
                    myCharts.setOption(option);
                    myCharts.refresh();
                } else {
                    console.log(parent);
                    alert("根节点不能删的哦～");
                }
                $('#delete [type="submit"]').off();
                $('#main').trigger('click');
            });

            // 展开和收缩节点
            $('#SBContent').on('click', ecData, SBContent);

            // 复制节点
            $('#copyContent').on('click', function() {
                console.log(ecData.name);
                var thisValue = ecData.data.value;
                var current = findCurrentNodeByValue(thisValue);
                // console.log("copy:");
                myCopyContent = JSON.parse(JSON.stringify(current));
                // console.log(myCopyContent);
                $('#copyContent').off();
            });

            // 粘贴节点
            $('#pasteToContent').on('click', function() {
                var thisValue = ecData.data.value;
                var current = findCurrentNodeByValue(thisValue);
                myCopyContent2 = {
                    "name": 12,
                    "value": 1,
                    "children": []
                };
                var cloneObj = JSON.parse(JSON.stringify(myCopyContent));
                // console.log(cloneObj);
                if (myCopyContent != null) {
                    current.children.push(cloneObj);
                }
                myCharts.clear();
                myCharts.setOption(option);
                myCharts.refresh();
                $('#pasteToContent').off();
            });

            // 取消注册的事件，十分关键！
            $('#main').on('click', function() {
                console.log("I am in the main!!!");
                $('#create [type="submit"]').off();
                $('#delete [type="submit"]').off();
                $('#SBContent').off();
                $('#copyContent').off();
                $('#pasteToContent').off();
            });
        });

        //用来存储子节点（供收缩，打开节点使用
        var clickMap={};
         // The delay time，用来实现双击事件
        var TimeFn = 0;
        // 处理单击收缩扩张
        function SBContent(event) {
            // console.log(ecData);
             // Clear Last timeout
            // clearTimeout(TimeFn);
            // TimeFn = setTimeout(function(){
                var _name = event.data.name;//当前点击节点的名称
                // console.log(findCurrentNodeByName(_name));
                // if(_posarr) {
                //     var _posarr=null;
                // }
                // var _posarr_=_posarr;//所有老节点的信息{[name,x,y],[name,x,y]..}//貌似没啥用

                // for(var iii= 0 ; iii<_posarr_.length;iii++){
                //   alert(_posarr_[iii]);
                // }
                // console.log(event.data);
                var isChild = event.data.data.children;//是否存在子节点
                //alert(!(!isChild));
                var _option = option;
                // console.log(_option);
                var len1=_option.series[0].data.length;
                var d1=_option.series[0].data;//所有的d*在下面代码中均为使用到。
                var f=false;//是否找到对应节点【循环所有数据，查找到 be clicked node 在option中的位置】//----f=true.跳出所有循环
                //循环clickMap中所有的节点信息
                //for(var prop in clickMap){
                //  if(clickMap.hasOwnProperty(prop)){
                //      alert(prop+'-'+clickMap[prop]);
                //  }
                //}
                //开始循环_option中的信息，用来查找当前点击的节点
                for(var j = 0;j < len1;j++) {
                    //alert('d1[j].name='+d1[j].name);
                    //第一个节点不让关闭（收起）
                    if(_option.series[0].data[j].name == _name) {
                        // console.log('I am in the first node!');
                        // 假设是关闭的
                        if (clickMap.hasOwnProperty(_name) && clickMap[_name] != null) {
                            // console.log("is closed before!");
                            _option.series[0].data[j].children = clickMap[_name];
                            clickMap[_name] = null;
                            f = true;
                        }
                        if (f)
                            break;
                        // 来到这里说明原来是打开的，现在要关闭
                        clickMap[_name] = _option.series[0].data[j].children;
                        _option.series[0].data[j].children = [];
                        // console.log(clickMap[_name]);
                    }
                    //alert(d1[j].children);
                    if(_option.series[0].data[j].children) {//若存在子节点
                        var len2=_option.series[0].data[j].children.length;
                        var d2=_option.series[0].data[j].children;
                        for(var k=0;k<len2;k++) {
                            //alert('j:'+j+'--k:'+k+'-'+d2[k].name);
                            //根据name判断节点是否是当前所点击的节点，
                            if(_option.series[0].data[j].children[k].name==_name) {
                                // console.log(clickMap);
                                //判断该节点是否已关闭，若clickMap中存在k为当前节点名称的数据，并且不为空。则说明已关闭，要打开。
                                if(clickMap.hasOwnProperty(_name) && clickMap[_name]!=null){
                                    // console.log(_name+' has closed . open now.');
                                    //将clickMap中的该节点的子节点信息重新赋值给当前节点
                                    _option.series[0].data[j].children[k].children=clickMap[_name];
                                    clickMap[_name]=null;//成功打开后，将clickMap中的数据赋null
                                    f=true;
                                    //跳出所有循环。
                                    break;
                                }
                                //执行到这里，说明未关闭。执行关闭操作
                                f=true;
                                //若所点击的节点存在子节点，则
                                if(_option.series[0].data[j].children[k].children) {
                                    //将子节点信息存入clickMap，形式【当前点击节点的name为key，子节点数据为value】
                                    clickMap[_option.series[0].data[j].children[k].name]=_option.series[0].data[j].children[k].children;
                                    // console.log(clickMap);
                                    //然后将_option中的当前子节点删除。
                                    delete _option.series[0].data[j].children[k].children;
                                }
                                //alert('find the node.j='+j+';k='+k);

                                //跳出所有循环
                                break;
                            }//else{alert(' not find the node.j='+j+';k='+k);}
                            if(f)break;
                            if(_option.series[0].data[j].children[k].children){
                                var len3=_option.series[0].data[j].children[k].children.length;
                                var d3=_option.series[0].data[j].children[k].children;
                                for(var l=0;l<len3;l++){
                                    //alert('j:'+j+'--k:'+k+'--l:'+l+'-'+d3[l].name);
                                    if(_option.series[0].data[j].children[k].children[l].name==_name){
                                        if(clickMap.hasOwnProperty(_name) && clickMap[_name]!=null){
                                            //alert(_name+'has closed . open now.');
                                            _option.series[0].data[j].children[k].children[l].children=clickMap[_name];
                                            clickMap[_name]=null;
                                            f=true;
                                            break;
                                        }
                                        f=true;
                                        //alert('find the node.j='+j+';k='+k+';l='+l+'--'+_option.series[0].data[j].children[k].children[l].name);
                                        if(_option.series[0].data[j].children[k].children[l].children){
                                            clickMap[_option.series[0].data[j].children[k].children[l].name]=_option.series[0].data[j].children[k].children[l].children;
                                            delete _option.series[0].data[j].children[k].children[l].children;
                                        }
                                        break;
                                    }//else{alert(' not find the node.j='+j+';k='+k+';l='+l+'--'+d3[l].name);}
                                    if(f)break;
                                    if(_option.series[0].data[j].children[k].children[l].children){
                                        var len4=_option.series[0].data[j].children[k].children[l].children.length;
                                        var d4=_option.series[0].data[j].children[k].children[l].children;
                                        for(var m=0;m<len4;m++){
                                            if(_option.series[0].data[j].children[k].children[l].children[m].name==_name){
                                                if(clickMap.hasOwnProperty(_name) && clickMap[_name]!=null){
                                                    //alert(_name+'has closed . open now.');
                                                    _option.series[0].data[j].children[k].children[l].children[m].children=clickMap[_name];
                                                    clickMap[_name]=null;
                                                    f=true;
                                                    break;
                                                }
                                                f=true;
                                                //alert('find the node.j='+j+';k='+k+';l='+l+';m='+m+'--'+_option.series[0].data[j].children[k].children[l].children[m].name);
                                                if(_option.series[0].data[j].children[k].children[l].children[m].children){
                                                    clickMap[_option.series[0].data[j].children[k].children[l].children[m].name]=_option.series[0].data[j].children[k].children[l].children[m].children;
                                                    delete _option.series[0].data[j].children[k].children[l].children[m].children;
                                                }
                                                break;
                                            }//else{alert(' not find the node.j='+j+';k='+k+';l='+l+';m='+m+'--'+d4[m].name);}
                                            if(f)break;
                                            if(_option.series[0].data[j].children[k].children[l].children[m].children){
                                                var len5=_option.series[0].data[j].children[k].children[l].children[m].children.length;
                                                var d5=_option.series[0].data[j].children[k].children[l].children[m].children;
                                                for(var n = 0 ; n<len5;n++){
                                                    /**
                                                     * 最后一层循环
                                                     * 若有需要，可扩充
                                                     */
                                                    if(_option.series[0].data[j].children[k].children[l].children[m].children[n].name==_name){
                                                        if(clickMap.hasOwnProperty(_name)&&clickMap[_name]!=null){
                                                            //alert(_name+'has closed . open now.');
                                                            _option.series[0].data[j].children[k].children[l].children[m].children[n].children=clickMap[_name];
                                                            clickMap[_name]=null;
                                                            f=true;
                                                            break;
                                                        }
                                                        f=true;
                                                        //alert('find the final node .'+_option.series[0].data[j].children[k].children[l].children[m].children[n].name);
                                                        if(_option.series[0].data[j].children[k].children[l].children[m].children[n].children){
                                                            clickMap[_option.series[0].data[j].children[k].children[l].children[m].children[n].name]=_option.series[0].data[j].children[k].children[l].children[m].children[n].children;
                                                            delete _option.series[0].data[j].children[k].children[l].children[m].children[n].children;
                                                        }
                                                        break;
                                                    }//else{alert(' not find the final node .'+d5[n].name);}
                                                    if(f)break;
                                                }
                                            }//else{alert('d4[m]:'+d4[m].name +'-下没有子级');}
                                            if(f)break;
                                        }
                                    }//else{alert('d3[l]:'+d3[l].name+'-没有子级');}
                                    if(f)break;
                                }
                            }//else{alert('d2[k]:'+d2[k].name+'没有子级');}
                            if(f)break;
                        }
                    }//else{alert('d1[j]:'+d1[j].name+'下没有子级');}
                    if(f)break;
                }

                //alert('over.');
                //清空当前echarts
                 myCharts.clear();
                 //重新赋值，渲染图表
                 // console.log(_option);
                 myCharts.setOption(_option);

                // _posarr_=_posarr;//新的坐标？？？//待开发功能。
                // for(var ii= 0 ; ii<_posarr_.length;ii++){
                //   alert(_posarr_[ii]);
                // }
                 //刷新，没啥用。。
                 myCharts.refresh();
                //for(var i=0;i<_posarr_.length;i++){
                //  if(_name==_posarr_[i][0]){
                //      alert('当前点击：'+_posarr_[i]);
                //      break;
                //  }
                //}
                $('#SBContent').off();
            // }, 200);
        }

        // function findCurrentNodeByName(name) {
        //     // 是否找到相应节点
        //     var _option = option;
        //     var len1=_option.series[0].data.length;
        //     var d1=_option.series[0].data;//所有的d*在下面代码中均为使用到。
        //     var _name = name;
        //     // 开始循环_option中的信息，用来查找当前点击的节点
        //     // console.log("len1="+len1);
        //     for(var j = 0;j < len1;j++) {
        //         // 从第一个节点开始找
        //         if(_option.series[0].data[j].name == _name) {
        //             console.log('I am in the first node!');
        //             return _option.series[0].data[j];
        //         }
        //         if(_option.series[0].data[j].children) {//若存在子节点
        //             var len2=_option.series[0].data[j].children.length;
        //             var d2=_option.series[0].data[j].children;
        //             for(var k=0;k<len2;k++) {
        //                 //根据name判断节点是否是当前所点击的节点，
        //                 if(_option.series[0].data[j].children[k].name==_name) {
        //                     // console.log(_option.series[0].data[j].children[k]);
        //                     console.log('I am in the second node!');
        //                     return _option.series[0].data[j].children[k];
        //                 }
        //                 // 如果还有儿子
        //                 if(_option.series[0].data[j].children[k].children){
        //                     var len3=_option.series[0].data[j].children[k].children.length;
        //                     var d3=_option.series[0].data[j].children[k].children;
        //                     for(var l = 0; l < len3; l++){
        //                         if(_option.series[0].data[j].children[k].children[l].name == _name){
        //                             // console.log(_option.series[0].data[j].children[k].children[l]);
        //                             console.log('I am in the third node!');
        //                             return _option.series[0].data[j].children[k].children[l];
        //                         }
        //                         if(_option.series[0].data[j].children[k].children[l].children){
        //                             var len4=_option.series[0].data[j].children[k].children[l].children.length;
        //                             var d4=_option.series[0].data[j].children[k].children[l].children;
        //                             for(var m=0;m<len4;m++){
        //                                 if(_option.series[0].data[j].children[k].children[l].children[m].name==_name){
        //                                     console.log('I am in the fourth node!');
        //                                     return option.series[0].data[j].children[k].children[l].children[m];
        //                                 }
        //                                 if(_option.series[0].data[j].children[k].children[l].children[m].children){
        //                                     var len5=_option.series[0].data[j].children[k].children[l].children[m].children.length;
        //                                     var d5=_option.series[0].data[j].children[k].children[l].children[m].children;
        //                                     for(var n = 0 ; n<len5;n++){
        //                                         /**
        //                                          * 最后一层循环
        //                                          * 若有需要，可扩充
        //                                          */
        //                                         if(_option.series[0].data[j].children[k].children[l].children[m].children[n].name==_name){
        //                                             return _option.series[0].data[j].children[k].children[l].children[m].children[n];
        //                                         }
        //                                     }
        //                                 }
        //                             }
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }
        // function findParentNodeByName(name) {
        //     // 是否找到相应节点
        //     var _option = option;
        //     var len1=_option.series[0].data.length;
        //     var d1=_option.series[0].data;//所有的d*在下面代码中均为使用到。
        //     var _name = name;
        //     //开始循环_option中的信息，用来查找当前点击的节点
        //     for(var j = 0;j < len1;j++) {
        //         // 从第一个节点开始找
        //         if(_option.series[0].data[j].name == _name) {
        //             console.log('It is the root!');
        //             return new Error('It is the root!');
        //         }
        //         if(_option.series[0].data[j].children) {//若存在子节点
        //             var len2=_option.series[0].data[j].children.length;
        //             var d2=_option.series[0].data[j].children;
        //             for(var k=0;k<len2;k++) {
        //                 //根据name判断节点是否是当前所点击的节点，
        //                 if(_option.series[0].data[j].children[k].name==_name) {
        //                     console.log('I am in the second node!');
        //                     return _option.series[0].data[j];
        //                 }
        //                 // 如果还有儿子
        //                 if(_option.series[0].data[j].children[k].children){
        //                     var len3=_option.series[0].data[j].children[k].children.length;
        //                     var d3=_option.series[0].data[j].children[k].children;
        //                     for(var l=0;l<len3;l++){
        //                         if(_option.series[0].data[j].children[k].children[l].name==_name){
        //                             // console.log(_option.series[0].data[j].children[k]);
        //                             console.log('I am in the third node!');
        //                             return _option.series[0].data[j].children[k];
        //                         }
        //                         if(_option.series[0].data[j].children[k].children[l].children){
        //                             var len4=_option.series[0].data[j].children[k].children[l].children.length;
        //                             var d4=_option.series[0].data[j].children[k].children[l].children;
        //                             for(var m=0;m<len4;m++){
        //                                 if(_option.series[0].data[j].children[k].children[l].children[m].name==_name){
        //                                     console.log('I am in the fourth node!');
        //                                     return option.series[0].data[j].children[k].children[l];
        //                                 }
        //                                 if(_option.series[0].data[j].children[k].children[l].children[m].children){
        //                                     var len5=_option.series[0].data[j].children[k].children[l].children[m].children.length;
        //                                     var d5=_option.series[0].data[j].children[k].children[l].children[m].children;
        //                                     for(var n = 0 ; n<len5;n++){
        //                                         /**
        //                                          * 最后一层循环
        //                                          * 若有需要，可扩充
        //                                          */
        //                                         if(_option.series[0].data[j].children[k].children[l].children[m].children[n].name==_name){
        //                                             return _option.series[0].data[j].children[k].children[l].children[m];
        //                                         }
        //                                     }
        //                                 }
        //                             }
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }i
        function findCurrentNodeByValue(value) {
            // 是否找到相应节点
            var _option = option;
            var len1=_option.series[0].data.length;
            var d1=_option.series[0].data;//所有的d*在下面代码中均为使用到。
            var _value = value;
            // 开始循环_option中的信息，用来查找当前点击的节点
            // console.log("len1="+len1);
            for(var j = 0;j < len1;j++) {
                // 从第一个节点开始找
                if(_option.series[0].data[j].value == _value) {
                    console.log('I am in the first node!');
                    return _option.series[0].data[j];
                }
                if(_option.series[0].data[j].children) {//若存在子节点
                    var len2=_option.series[0].data[j].children.length;
                    var d2=_option.series[0].data[j].children;
                    for(var k=0;k<len2;k++) {
                        //根据value判断节点是否是当前所点击的节点，
                        if(_option.series[0].data[j].children[k].value==_value) {
                            // console.log(_option.series[0].data[j].children[k]);
                            console.log('I am in the second node!');
                            return _option.series[0].data[j].children[k];
                        }
                        // 如果还有儿子
                        if(_option.series[0].data[j].children[k].children){
                            var len3=_option.series[0].data[j].children[k].children.length;
                            var d3=_option.series[0].data[j].children[k].children;
                            for(var l = 0; l < len3; l++){
                                if(_option.series[0].data[j].children[k].children[l].value == _value){
                                    // console.log(_option.series[0].data[j].children[k].children[l]);
                                    console.log('I am in the third node!');
                                    return _option.series[0].data[j].children[k].children[l];
                                }
                                if(_option.series[0].data[j].children[k].children[l].children){
                                    var len4=_option.series[0].data[j].children[k].children[l].children.length;
                                    var d4=_option.series[0].data[j].children[k].children[l].children;
                                    for(var m=0;m<len4;m++){
                                        if(_option.series[0].data[j].children[k].children[l].children[m].value==_value){
                                            console.log('I am in the fourth node!');
                                            return option.series[0].data[j].children[k].children[l].children[m];
                                        }
                                        if(_option.series[0].data[j].children[k].children[l].children[m].children){
                                            var len5=_option.series[0].data[j].children[k].children[l].children[m].children.length;
                                            var d5=_option.series[0].data[j].children[k].children[l].children[m].children;
                                            for(var n = 0 ; n<len5;n++){
                                                /**
                                                 * 最后一层循环
                                                 * 若有需要，可扩充
                                                 */
                                                if(_option.series[0].data[j].children[k].children[l].children[m].children[n].value==_value){
                                                    return _option.series[0].data[j].children[k].children[l].children[m].children[n];
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        function findParentNodeByValue(value) {
            // 是否找到相应节点
            var _option = option;
            var len1=_option.series[0].data.length;
            var d1=_option.series[0].data;//所有的d*在下面代码中均为使用到。
            var _value = value;
            //开始循环_option中的信息，用来查找当前点击的节点
            for(var j = 0;j < len1;j++) {
                // 从第一个节点开始找
                if(_option.series[0].data[j].value == _value) {
                    console.log('It is the root!');
                    return new Object();
                }
                if(_option.series[0].data[j].children) {//若存在子节点
                    var len2=_option.series[0].data[j].children.length;
                    var d2=_option.series[0].data[j].children;
                    for(var k=0;k<len2;k++) {
                        //根据value判断节点是否是当前所点击的节点，
                        if(_option.series[0].data[j].children[k].value==_value) {
                            console.log('I am in the second node!');
                            return _option.series[0].data[j];
                        }
                        // 如果还有儿子
                        if(_option.series[0].data[j].children[k].children){
                            var len3=_option.series[0].data[j].children[k].children.length;
                            var d3=_option.series[0].data[j].children[k].children;
                            for(var l=0;l<len3;l++){
                                if(_option.series[0].data[j].children[k].children[l].value==_value){
                                    // console.log(_option.series[0].data[j].children[k]);
                                    console.log('I am in the third node!');
                                    return _option.series[0].data[j].children[k];
                                }
                                if(_option.series[0].data[j].children[k].children[l].children){
                                    var len4=_option.series[0].data[j].children[k].children[l].children.length;
                                    var d4=_option.series[0].data[j].children[k].children[l].children;
                                    for(var m=0;m<len4;m++){
                                        if(_option.series[0].data[j].children[k].children[l].children[m].value==_value){
                                            console.log('I am in the fourth node!');
                                            return option.series[0].data[j].children[k].children[l];
                                        }
                                        if(_option.series[0].data[j].children[k].children[l].children[m].children){
                                            var len5=_option.series[0].data[j].children[k].children[l].children[m].children.length;
                                            var d5=_option.series[0].data[j].children[k].children[l].children[m].children;
                                            for(var n = 0 ; n<len5;n++){
                                                /**
                                                 * 最后一层循环
                                                 * 若有需要，可扩充
                                                 */
                                                if(_option.series[0].data[j].children[k].children[l].children[m].children[n].value==_value){
                                                    return _option.series[0].data[j].children[k].children[l].children[m];
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        $('#save').on('click', function() {
            var filename = prompt('保存的文件名是：');
            inputData.filename = filename;
        });
    });
}));
