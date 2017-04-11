// 创建新的思维导图
($(function() {

    $.get('/api/create.json').done(function() {
        var leafBase, username, filename, leafUrl, isFileNewUrl, isFileExist;
        username = $('#getUsername').val();
        filename = $('#getFilename').val();
        console.log(username);
        console.log(filename);
        leafBase = '/api/getFileFromDatabase'
        leafUrl = leafBase + '/' + username + '/' + filename;
        console.log("leafUrl" + leafUrl);

        // 判断文件是否存在
        isFileNewUrl = '/api/isFileNew' + '/' + username + '/' + filename;
        isFileExist;
        console.log(isFileNewUrl);
        // 判断是否是新建的节点
        $.get(isFileNewUrl).done(function(response, status, xhr) {
            var rootname;
            isFileExist = !response.isFileNew;
            // 文件不存在
            if (isFileExist == false) {
                rootname = prompt("请输入根节点名字");
                if (rootname == null || rootname == "")
                    rootname = "default";
                leafUrl = '/api/create.json';
            }
            // 得到file信息
            $.get(leafUrl).done(function(json, status, xhr) {
                console.log(json);
                var initObj = {
                    "filename": filename,
                    "rootname": rootname,
                    "username": username,
                    "isFileExist": isFileExist
                }
                var inputData = initTree(initObj, json);
                console.log(inputData);
                $('#main').css('height', '5000px');
                $('#main').css('width', '5000px');
                var myCharts = echarts.init($("#main").get(0));
                var option = optionConfig(inputData);
                myCharts.setOption(option);

                // 默认点击根节点
                var rootValue = inputData.tree[0].value;
                console.log("rootValue: " + rootValue);
                $('#getNodeId').val(rootValue);
                $('#getNodeId').trigger('input'); // Use for Chrome/Firefox/Edge
                console.log(findPathFromSelfToRoot(rootValue, rootValue).toString());
                $('#getNodeString').val(findPathFromSelfToRoot(rootValue, rootValue).toString());
                $('#getNodeString').trigger('input'); // Use for Chrome/Firefox/Edge
                $('#getNodeDataBtn').click();

                var myCopyContent = {};

                // 上移下移
                $('#up').on('click', up);

                $('#down').on('click', down);

                $('#left').on('click', function() {
                    $('#main').css('left', function(index, value) {
                        return parseInt(value) - 50 + "px";
                    });
                });
                $('#right').on('click', function() {
                    $('#main').css('left', function(index, value) {
                        return parseInt(value) + 50 + "px";
                    });
                });


                myCharts.on("click", function(ecData) {
                    // 创建新节点
                    $('button#create').on('click', function(event) {
                        console.log("creat");
                        console.log(ecData.name);

                        var newNodeName = window.prompt("请输入你要添加的节点的名字:");
                        var thisValue = ecData.data.value;
                        var current = findCurrentNodeByValue(thisValue);
                        var currentChildren = current.children;
                        var selfValue = getRandomValue();
                        var newObj = {
                            name: newNodeName,
                            value: selfValue,
                            children: []
                        };
                        if (current.children == undefined)
                            current.children = [];
                        current.children.push(newObj);
                        myCharts.clear();
                        myCharts.setOption(option);
                        myCharts.refresh();
                        $('#main').trigger('click');
                    });
                    // $('button#create').trigger("click");
                    // 删除节点
                    $('button#delete').on('click', function(event) {
                        console.log("delete");
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
                        // $('#delete').off();
                        $('#main').trigger('click');
                    });
                    // $('button#delete').trigger("click");
                    // 展开和收缩节点
                    $('button#SBContent').on('click', ecData, SBContent);
                    // $('button#SBContent').trigger("click");

                    // 复制节点
                    $('button#copyContent').on('click', function() {
                        console.log("copyContent");
                        // console.log(ecData.name);
                        var thisValue = ecData.data.value;
                        var current = findCurrentNodeByValue(thisValue);
                        // console.log("copy:");
                        // 深复制
                        myCopyContent = JSON.parse(JSON.stringify(current));
                        // console.log(myCopyContent);
                        // $('#copyContent').off();
                        $('#main').trigger('click');
                    });
                    // $('button#copyContent').trigger("click");

                    // 粘贴节点
                    $('button#pasteToContent').on('click', function() {
                        var thisValue = ecData.data.value;
                        var current = findCurrentNodeByValue(thisValue);
                        var cloneObj = JSON.parse(JSON.stringify(myCopyContent));
                        cloneObj = recurChangeValuesForObject(cloneObj);
                        if (myCopyContent != null) {
                            if (current.children == undefined)
                                current.children = [];
                            // console.log("myCopyContent:");
                            // console.log(myCopyContent);
                            // myCopyContent为空不执行
                            if ($.isEmptyObject(myCopyContent)) {
                                alert("请你先选中被复制节点");
                            } else {
                                current.children.push(cloneObj);
                            }
                        }
                        myCharts.clear();
                        myCharts.setOption(option);
                        myCharts.refresh();
                        // $('#pasteToContent').off();
                        $('#main').trigger('click');
                    });
                    // $('button#pasteToContent').trigger("click");

                    // 取消注册的事件，十分关键！
                    $('#main').on('click', function() {
                        // console.log("I am in the main!!!");
                        $('button#create').off();
                        $('button#delete').off();
                        $('button#SBContent').off();
                        $('button#copyContent').off();
                        $('button#pasteToContent').off();
                        $('#main').off();
                    });
                    var value = getValue(ecData);
                    var rootValue = inputData.tree[0].value;
                    // console.log("rootValue: " + rootValue);
                    $('#getNodeId').val(value);
                    $('#getNodeId').trigger('input'); // Use for Chrome/Firefox/Edge
                    // console.log(findPathFromSelfToRoot(value, rootValue).toString());
                    $('#getNodeString').val(findPathFromSelfToRoot(value, rootValue).toString());
                    $('#getNodeString').trigger('input'); // Use for Chrome/Firefox/Edge
                    $('#getNodeDataBtn').click();
                });

                //用来存储子节点（供收缩，打开节点使用
                var clickMap = {};
                // The delay time，用来实现双击事件
                var TimeFn = 0;
                // 处理单击收缩扩张
                function SBContent(event) {
                    // console.log(ecData);
                    // Clear Last timeout
                    // clearTimeout(TimeFn);
                    // TimeFn = setTimeout(function(){
                    var _name = event.data.name; //当前点击节点的名称
                    // console.log(findCurrentNodeByName(_name));
                    // if(_posarr) {
                    //     var _posarr=null;
                    // }
                    // var _posarr_=_posarr;//所有老节点的信息{[name,x,y],[name,x,y]..}//貌似没啥用

                    // for(var iii= 0 ; iii<_posarr_.length;iii++){
                    //   alert(_posarr_[iii]);
                    // }
                    // console.log(event.data);
                    var isChild = event.data.data.children; //是否存在子节点
                    //alert(!(!isChild));
                    var _option = option;
                    // console.log(_option);
                    var len1 = _option.series[0].data.length;
                    var d1 = _option.series[0].data; //所有的d*在下面代码中均为使用到。
                    var f = false; //是否找到对应节点【循环所有数据，查找到 be clicked node 在option中的位置】//----f=true.跳出所有循环
                    //循环clickMap中所有的节点信息
                    //for(var prop in clickMap){
                    //  if(clickMap.hasOwnProperty(prop)){
                    //      alert(prop+'-'+clickMap[prop]);
                    //  }
                    //}
                    //开始循环_option中的信息，用来查找当前点击的节点
                    for (var j = 0; j < len1; j++) {
                        //alert('d1[j].name='+d1[j].name);
                        //第一个节点不让关闭（收起）
                        if (_option.series[0].data[j].name == _name) {
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
                        if (_option.series[0].data[j].children) { //若存在子节点
                            var len2 = _option.series[0].data[j].children.length;
                            var d2 = _option.series[0].data[j].children;
                            for (var k = 0; k < len2; k++) {
                                //alert('j:'+j+'--k:'+k+'-'+d2[k].name);
                                //根据name判断节点是否是当前所点击的节点，
                                if (_option.series[0].data[j].children[k].name == _name) {
                                    // console.log(clickMap);
                                    //判断该节点是否已关闭，若clickMap中存在k为当前节点名称的数据，并且不为空。则说明已关闭，要打开。
                                    if (clickMap.hasOwnProperty(_name) && clickMap[_name] != null) {
                                        // console.log(_name+' has closed . open now.');
                                        //将clickMap中的该节点的子节点信息重新赋值给当前节点
                                        _option.series[0].data[j].children[k].children = clickMap[_name];
                                        clickMap[_name] = null; //成功打开后，将clickMap中的数据赋null
                                        f = true;
                                        //跳出所有循环。
                                        break;
                                    }
                                    //执行到这里，说明未关闭。执行关闭操作
                                    f = true;
                                    //若所点击的节点存在子节点，则
                                    if (_option.series[0].data[j].children[k].children) {
                                        //将子节点信息存入clickMap，形式【当前点击节点的name为key，子节点数据为value】
                                        clickMap[_option.series[0].data[j].children[k].name] = _option.series[0].data[j].children[k].children;
                                        // console.log(clickMap);
                                        //然后将_option中的当前子节点删除。
                                        delete _option.series[0].data[j].children[k].children;
                                    }
                                    //alert('find the node.j='+j+';k='+k);

                                    //跳出所有循环
                                    break;
                                } //else{alert(' not find the node.j='+j+';k='+k);}
                                if (f) break;
                                if (_option.series[0].data[j].children[k].children) {
                                    var len3 = _option.series[0].data[j].children[k].children.length;
                                    var d3 = _option.series[0].data[j].children[k].children;
                                    for (var l = 0; l < len3; l++) {
                                        //alert('j:'+j+'--k:'+k+'--l:'+l+'-'+d3[l].name);
                                        if (_option.series[0].data[j].children[k].children[l].name == _name) {
                                            if (clickMap.hasOwnProperty(_name) && clickMap[_name] != null) {
                                                //alert(_name+'has closed . open now.');
                                                _option.series[0].data[j].children[k].children[l].children = clickMap[_name];
                                                clickMap[_name] = null;
                                                f = true;
                                                break;
                                            }
                                            f = true;
                                            //alert('find the node.j='+j+';k='+k+';l='+l+'--'+_option.series[0].data[j].children[k].children[l].name);
                                            if (_option.series[0].data[j].children[k].children[l].children) {
                                                clickMap[_option.series[0].data[j].children[k].children[l].name] = _option.series[0].data[j].children[k].children[l].children;
                                                delete _option.series[0].data[j].children[k].children[l].children;
                                            }
                                            break;
                                        } //else{alert(' not find the node.j='+j+';k='+k+';l='+l+'--'+d3[l].name);}
                                        if (f) break;
                                        if (_option.series[0].data[j].children[k].children[l].children) {
                                            var len4 = _option.series[0].data[j].children[k].children[l].children.length;
                                            var d4 = _option.series[0].data[j].children[k].children[l].children;
                                            for (var m = 0; m < len4; m++) {
                                                if (_option.series[0].data[j].children[k].children[l].children[m].name == _name) {
                                                    if (clickMap.hasOwnProperty(_name) && clickMap[_name] != null) {
                                                        //alert(_name+'has closed . open now.');
                                                        _option.series[0].data[j].children[k].children[l].children[m].children = clickMap[_name];
                                                        clickMap[_name] = null;
                                                        f = true;
                                                        break;
                                                    }
                                                    f = true;
                                                    //alert('find the node.j='+j+';k='+k+';l='+l+';m='+m+'--'+_option.series[0].data[j].children[k].children[l].children[m].name);
                                                    if (_option.series[0].data[j].children[k].children[l].children[m].children) {
                                                        clickMap[_option.series[0].data[j].children[k].children[l].children[m].name] = _option.series[0].data[j].children[k].children[l].children[m].children;
                                                        delete _option.series[0].data[j].children[k].children[l].children[m].children;
                                                    }
                                                    break;
                                                } //else{alert(' not find the node.j='+j+';k='+k+';l='+l+';m='+m+'--'+d4[m].name);}
                                                if (f) break;
                                                if (_option.series[0].data[j].children[k].children[l].children[m].children) {
                                                    var len5 = _option.series[0].data[j].children[k].children[l].children[m].children.length;
                                                    var d5 = _option.series[0].data[j].children[k].children[l].children[m].children;
                                                    for (var n = 0; n < len5; n++) {
                                                        /**
                                                         * 最后一层循环
                                                         * 若有需要，可扩充
                                                         */
                                                        if (_option.series[0].data[j].children[k].children[l].children[m].children[n].name == _name) {
                                                            if (clickMap.hasOwnProperty(_name) && clickMap[_name] != null) {
                                                                //alert(_name+'has closed . open now.');
                                                                _option.series[0].data[j].children[k].children[l].children[m].children[n].children = clickMap[_name];
                                                                clickMap[_name] = null;
                                                                f = true;
                                                                break;
                                                            }
                                                            f = true;
                                                            //alert('find the final node .'+_option.series[0].data[j].children[k].children[l].children[m].children[n].name);
                                                            if (_option.series[0].data[j].children[k].children[l].children[m].children[n].children) {
                                                                clickMap[_option.series[0].data[j].children[k].children[l].children[m].children[n].name] = _option.series[0].data[j].children[k].children[l].children[m].children[n].children;
                                                                delete _option.series[0].data[j].children[k].children[l].children[m].children[n].children;
                                                            }
                                                            break;
                                                        } //else{alert(' not find the final node .'+d5[n].name);}
                                                        if (f) break;
                                                    }
                                                } //else{alert('d4[m]:'+d4[m].name +'-下没有子级');}
                                                if (f) break;
                                            }
                                        } //else{alert('d3[l]:'+d3[l].name+'-没有子级');}
                                        if (f) break;
                                    }
                                } //else{alert('d2[k]:'+d2[k].name+'没有子级');}
                                if (f) break;
                            }
                        } //else{alert('d1[j]:'+d1[j].name+'下没有子级');}
                        if (f) break;
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

                function findParentNodeByValue(value) {
                    var data = option.series[0].data[0];
                    // console.log(data);
                    // console.log(callFindCurrentNode(data, value));
                    return callFindParentNode(data, value);
                }

                function callFindParentNode(data, value) {
                    // 防止出现undefined的情况
                    if (data.children == undefined)
                        data.children = [];
                    for (let i = 0; i < data.children.length; i++) {
                        if (data.children[i].value == value) {
                            return data;
                        } else {
                            var result = callFindParentNode(data.children[i], value);
                            if (result != undefined)
                                return result;
                        }
                    }
                }

                function findCurrentNodeByValue(value) {
                    var data = option.series[0].data[0];
                    // console.log(data);
                    // console.log(callFindCurrentNode(data, value));
                    return callFindCurrentNode(data, value);
                }

                function callFindCurrentNode(data, value) {
                    if (data.value == value) {
                        return data;
                    } else {
                        if (data.children == undefined)
                            data.children = [];
                        for (let i = 0; i < data.children.length; i++) {
                            console.log(data.children.length);
                            console.log(data.children[i]);
                            var result = callFindCurrentNode(data.children[i], value);
                            if (result != undefined)
                                return result;
                        }
                    }
                }

                function findNameByValue(value) {
                    // console.log(value);
                    // console.log(findCurrentNodeByValue(value));
                    return findCurrentNodeByValue(value).name;
                }

                function isNULL(data) {
                    return JSON.stringify(data) == '[]' || data == null || data == undefined || JSON.stringify(data) == '{}';
                }

                function findPathFromSelfToRoot(value, rootValue) {
                    console.log("value in path:"+value);
                    var path = [];
                    var selfValue = value;
                    path.push(findNameByValue(selfValue));
                    while (selfValue != rootValue) {
                        selfValue = findParentNodeByValue(selfValue, rootValue).value;
                        path.push(findNameByValue(selfValue));
                    }
                    return path;
                }

                function recurChangeValuesForObject(cloneObj) {
                    // 无孩子
                    if (cloneObj.children == undefined) {
                        cloneObj.value = getRandomValue();
                    } else {
                        cloneObj.value = getRandomValue();
                        for (let i = 0; i < cloneObj.children.length; i++)
                            recurChangeValuesForObject(cloneObj.children[i]);
                    }
                    return cloneObj;
                }

                function getValue(ecData) {
                    return ecData.data.value;
                }

                // 保存
                $('#save').on('click', function() {
                    inputData.filename = filename;
                    // console.log("I am inputData:");
                    // console.log(inputData);
                    if (!isOnlyRoot(option)) {
                        // 保存到文件数据库
                        $.post('/api/saveFileToDatabase/' + filename, inputData);
                        alert("保存成功!");
                    } else {
                        alert("保存失败，不允许仅有根节点");
                    }
                });

                // 收藏
                $('#star').on('click', function() {
                    inputData.filename = filename;
                    console.log("I am inputData in star:");
                    console.log(inputData);
                    $.post('/api/starFile', inputData);
                    alert("收藏成功!");
                });

                // 克隆
                $('#clone').on('click', function() {
                    inputData.filename = filename;
                    console.log("I am inputData in star:");
                    console.log(inputData);
                    $.post('/api/cloneFile', inputData);
                    alert("克隆成功!");
                });

                // 删除文件
                $('#deleteFile').on('click', function() {
                    inputData.filename = filename;
                    console.log("I am inputData in star:");
                    console.log(inputData);
                    if (confirm("你确定要删除吗?")) {
                        $.post('/api/deleteFile', inputData);
                        alert("删除成功!");
                    }
                });

                // 修改文件名
                // $('#changeFilename').on('click', function() {
                //     inputData.filename = filename;
                //     console.log("I am inputData in star:");
                //     console.log(inputData);
                //     $.post('/api/changeFilename', inputData);
                //     alert("修改文件名成功!");
                // });

                function up() {
                    console.log("up!");
                    $('#main').css('top', function(index, value) {
                        return parseInt(value) - 50 + "px";
                    });
                }

                function down() {
                    $('#main').css('top', function(index, value) {
                        return parseInt(value) + 50 + "px";
                    });
                }

                function getRandomValue() {
                    return Math.random().toString(35);
                }

                // json是get到的原始数据
                function initTree(initObj, json) {
                    if (!initObj.isFileExist) {
                        var rootValue = getRandomValue();
                        var rootNode = {
                            "name": initObj.rootname,
                            "value": rootValue,
                            "children": []
                        };
                        json.filename = initObj.filename;
                        json.author = initObj.username;
                        json.tree.push(rootNode);
                    }
                    var inputData = json;
                    return inputData;
                }

                function optionConfig(inputData) {
                    var option = {
                        title: {
                            // text: "Limb",
                            // subtext: "Made By konigsberg",
                        },
                        legend: {
                            // 和series里面的name对应
                            data: ["default"],
                        },
                        // 工具箱
                        toolbox: {
                            show: true,
                            feature: {
                                // mark: {show: true},
                                // dataZoom: {show: true},
                                // dataView: {show: true},
                                // restore: {show: true},
                                saveAsImage: {
                                    show: true
                                },
                            }
                        },
                        calculable: false,
                        tooltip: {
                            // 节点可以进入
                            show: true,
                            formatter: '{b}',
                        },
                        series: [{
                            name: "default",
                            type: 'tree',
                            // 树的展示方式
                            orient: 'horizontal',
                            rootLocation: {
                                x: 50,
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
                            // clickable: true,
                            // roam: true,
                            // 是否反转
                            // direction: 'inverse',
                            data: inputData.tree
                        }],
                    };
                    return option;
                }

                function isOnlyRoot(option) {
                    // console.log("I am in root!");
                    return option.series[0].data[0].children.length == 0;
                }

                $(window).on("beforeunload", function() {
                    // $("#save").trigger("click");
                    return "系统将会为你自动保存";
                });
            });
        });
    });

}()));
