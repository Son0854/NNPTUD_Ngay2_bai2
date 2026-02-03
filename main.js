async function getData() {
    try {
        let res = await fetch('http://localhost:3000/posts');
        let posts = await res.json();
        let body = document.getElementById('table_body');
        body.innerHTML = '';
        for (const post of posts) {
            // Kiểm tra xem post có bị xóa mềm không
            let isDeleted = post.isDeleted === true;
            let rowStyle = isDeleted ? "style='text-decoration: line-through;'" : "";
            let deleteButton = isDeleted 
                ? `<input type='submit' value='Un-delete' onclick='UnDelete(${post.id})'>` 
                : `<input type='submit' value='Delete' onclick='Delete(${post.id})'>`;
            
            body.innerHTML += `<tr ${rowStyle}>
                <td>${post.id}</td>
                <td>${post.title}</td>
                <td>${post.views}</td>
                <td>${deleteButton}</td>
            </tr>`
        }
    } catch (error) {
        console.log(error);
    }
}
async function Save() {
    let id = document.getElementById('txt_id').value;
    let title = document.getElementById('txt_title').value;
    let views = document.getElementById('txt_views').value;
    let getItem = await fetch('http://localhost:3000/posts/' + id);
    if (getItem.ok) {
        //edit
        let res = await fetch('http://localhost:3000/posts/'+id, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                views: views
            })
        })
        if (res.ok) {
            console.log("thanh cong");
            getData(); // Refresh lại bảng
        }
    } else {
        //create
        let res = await fetch('http://localhost:3000/posts', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id,
                title: title,
                views: views,
                isDeleted: false
            })
        })
        if (res.ok) {
            console.log("thanh cong");
            getData(); // Refresh lại bảng
        }
    }
}
async function Delete(id) {
    // Xóa mềm: thêm isDeleted: true vào đối tượng
    let getItem = await fetch('http://localhost:3000/posts/' + id);
    if (getItem.ok) {
        let post = await getItem.json();
        let res = await fetch('http://localhost:3000/posts/' + id, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...post,
                isDeleted: true
            })
        })
        if (res.ok) {
            console.log("xoa mem thanh cong");
            getData(); // Refresh lại bảng
        }
    }
}

async function UnDelete(id) {
    // Khôi phục post đã xóa mềm
    let getItem = await fetch('http://localhost:3000/posts/' + id);
    if (getItem.ok) {
        let post = await getItem.json();
        let res = await fetch('http://localhost:3000/posts/' + id, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...post,
                isDeleted: false
            })
        })
        if (res.ok) {
            console.log("khoi phuc thanh cong");
            getData(); // Refresh lại bảng
        }
    }
}
getData();

